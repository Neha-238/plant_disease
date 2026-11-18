// IMAGE PREVIEW
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    if (!event.target.files.length) return;

    const reader = new FileReader();

    reader.onload = function () {
      const img = document.getElementById("imgPreview");
      img.src = reader.result;
      img.style.display = "block";
    };

    reader.readAsDataURL(event.target.files[0]);
  });

// BUTTON CLICK (NOT FORM SUBMIT)
document
  .getElementById("predictBtn")
  .addEventListener("click", async function () {
    const fileInput = document.getElementById("fileInput");
    const resultBox = document.getElementById("result");

    if (!fileInput.files.length) {
      resultBox.innerHTML = "⚠️ Please select an image first.";
      return;
    }

    resultBox.innerHTML = "🔄 Predicting disease...";

    let formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const response = await fetch("/predict", {
        method: "POST",
        body: formData,
      });

      let data = await response.json();

      resultBox.innerHTML = `
            🌿 Prediction: <b>${data.class}</b><br>
            🎯 Confidence: <b>${(data.confidence * 100).toFixed(2)}%</b>
        `;
    } catch (error) {
      console.log(error);
      resultBox.innerHTML = "❌ Backend not responding";
    }
  });
