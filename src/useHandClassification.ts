import { computed, ref } from '@vue/reactivity'
import '@tensorflow/tfjs'
import * as tmImage from '@teachablemachine/image'
import { onMounted } from '@vue/runtime-core'

/**
 * 手の種類を表します
 */
export type Hand = 'なし' | 'グー' | 'チョキ' | 'パー'

/**
 * 予測結果を表します
 */
export interface Predicted {
  name: Hand
  score: number
}

/**
 * 手の分類を行います。
 * @param modelId teachablemachineにアップロードしたモデルのID
 * @returns 手の分類結果
 */
export const useHandClassification = (modelId: string) => {
  const canvas = ref<HTMLCanvasElement>()

  const hands = ref<Predicted[]>([])
  const highestHand = computed(
    () =>
      [...hands.value].sort((a, b) => b.score - a.score)[0] ?? {
        name: 'なし',
        score: 0,
      }
  )
  const err = ref()
  const model = ref<tmImage.CustomMobileNet>()
  const loading = computed(() => !model.value)
  const ready = ref(true)

  const start = async () => {
    try {
      const webcam = new tmImage.Webcam(200, 200, false)
      await webcam.setup()
      await webcam.play()
      canvas.value ??= webcam.canvas
      canvas.value.height = webcam.height
      canvas.value.width = webcam.width
      webcam.canvas = canvas.value

      const predict = async () => {
        if (!model.value) return
        const predictions = await model.value.predict(webcam.canvas)
        hands.value = predictions.map((prediction) => ({
          name: prediction.className as Hand,
          score: prediction.probability,
        }))
      }
      const loop = async () => {
        webcam.update()
        await predict()
        window.requestAnimationFrame(loop)
      }
      window.requestAnimationFrame(loop)
      ready.value = false
    } catch (error) {
      err.value = error
    }
  }

  onMounted(async () => {
    const URL = `https://teachablemachine.withgoogle.com/models/${modelId}`
    const modelURL = `${URL}/model.json`
    const metadataURL = `${URL}/metadata.json`
    model.value = await tmImage.load(modelURL, metadataURL)
  })
  return {
    /**
     * WEBカメラの映像が映し出されるキャンバス
     */
    canvas,
    /**
     * 各手のリアルタイム予測結果
     */
    hands,
    /**
     * 最高スコアの手
     */
    highestHand,
    loading,
    start,
    ready,
    err,
  }
}
