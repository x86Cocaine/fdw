// Recherche dans le fichier .txt
function lookup() {
  const query = document.getElementById("search").value.trim();
  const resultBox = document.getElementById("result");

  if (!query) {
    resultBox.innerText = "⚠️ Merci d'entrer un terme valide.";
    return;
  }

  resultBox.innerText = "⏳ Recherche en cours...";
  fetch("100K_JOUEUR_FIVEM.txt")
    .then(response => {
      if (!response.ok) throw new Error("Fichier introuvable !");
      return response.text();
    })
    .then(text => {
      const lines = text.split("\n");
      const matches = lines
        .map((line, i) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            return `[Ligne ${i + 1}] : ${line}`;
          }
        })
        .filter(Boolean);

      if (matches.length > 0) {
        const resultText = matches.join("\n") + "\n\n✔ Résultats copiés dans le presse-papiers.";
        resultBox.innerText = resultText;
        navigator.clipboard.writeText(matches.join("\n"));
      } else {
        resultBox.innerText = "❌ Aucun résultat trouvé.";
      }
    })
    .catch(err => {
      resultBox.innerText = `❌ Erreur : ${err.message}`;
    });
}

// Lookup IP via AbstractAPI
function lookupIP() {
  const ip = document.getElementById("ipInput").value.trim();
  const ipBox = document.getElementById("ipResult");

  if (!ip) {
    ipBox.innerText = "⚠️ Merci d'entrer une adresse IP.";
    return;
  }

  ipBox.innerText = "⏳ Recherche IP...";
  fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=57209cadb9454a5dbcb6041c93e7f99a&ip_address=${ip}`)
    .then(res => res.json())
    .then(data => {
      ipBox.innerText =
        `🌍 Résultat IP :
- Pays : ${data.country || "?"}
- Ville : ${data.city || "?"}
- Région : ${data.region || "?"}
- FAI : ${data.connection?.isp_name || "?"}
- Type : ${data.connection?.connection_type || "?"}`;
    })
    .catch(() => {
      ipBox.innerText = "❌ Erreur lors de la recherche IP.";
    });
}

// Lookup numéro via NumVerify
function lookupPhone() {
  const number = document.getElementById("numInput").value.trim();
  const numBox = document.getElementById("numResult");

  if (!number) {
    numBox.innerText = "⚠️ Merci d'entrer un numéro.";
    return;
  }

  numBox.innerText = "⏳ Recherche numéro...";
  fetch(`http://apilayer.net/api/validate?access_key=189ab069164d3d776aaa6b178c360425&number=${number}`)
    .then(res => res.json())
    .then(data => {
      if (data.valid) {
        numBox.innerText =
          `📞 Résultat numéro :
- Pays : ${data.country_name || "?"}
- Code pays : +${data.country_code || "?"}
- Ligne : ${data.line_type || "?"}
- Opérateur : ${data.carrier || "?"}`;
      } else {
        numBox.innerText = "❌ Numéro invalide.";
      }
    })
    .catch(() => {
      numBox.innerText = "❌ Erreur lors de la recherche numéro.";
    });
}
