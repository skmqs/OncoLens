/**
 * ONNX Runtime Web inference utility.
 * Sessions are cached so models are only loaded once per page session.
 */
import * as ort from "onnxruntime-web";

// Cache so we don't reload the same model multiple times
const sessionCache = {};

/**
 * Load (or return cached) ONNX inference session.
 * @param {string} modelKey  - one of "logistic_regression" | "random_forest" | "svm"
 * @returns {Promise<ort.InferenceSession>}
 */
export async function getSession(modelKey) {
  if (sessionCache[modelKey]) return sessionCache[modelKey];

  const url = `/models/${modelKey}.onnx`;
  const sess = await ort.InferenceSession.create(url, {
    executionProviders: ["wasm"],
  });
  sessionCache[modelKey] = sess;
  return sess;
}

/**
 * Run inference.
 * @param {string}   modelKey  - model identifier
 * @param {number[]} features  - 30 float values in correct feature order
 * @returns {Promise<{predictedClass: number, probabilities: number[], predictedLabel: string}>}
 */
export async function runInference(modelKey, features) {
  const sess = await getSession(modelKey);

  // Build Float32 tensor [1, 30]
  const inputData = new Float32Array(features);
  const tensor = new ort.Tensor("float32", inputData, [1, features.length]);

  const inputName = sess.inputNames[0];
  const feeds = { [inputName]: tensor };

  const results = await sess.run(feeds);

  // Output names vary by model — typically "label" and "probabilities"
  const labelOutput = results[sess.outputNames[0]];
  const probOutput  = results[sess.outputNames[1]];

  const predictedClass = Number(labelOutput.data[0]);

  // probabilities come as flat array [prob_class0, prob_class1]
  const probabilities = Array.from(probOutput.data);

  // Class mapping: 0=malignant, 1=benign  (matches sklearn's target_names)
  const CLASS_NAMES = ["malignant", "benign"];
  const predictedLabel = CLASS_NAMES[predictedClass] ?? "unknown";

  return { predictedClass, probabilities, predictedLabel };
}
