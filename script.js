
const API_KEYS = {
  IP: "57209cadb9454a5dbcb6041c93e7f99a",
  PHONE: "189ab069164d3d776aaa6b178c360425",
  IBAN: "d593c768431d4ba5bb8561cedb610997",
  EMAIL: "b415d14b9bba41949eaf6675399ef48f",
  VAT: "911679cfbc0b463e8b28d44bb04c0c24"
};

function toggleDropdown() {
  const drop = document.getElementById("dropdownOSINT");
  drop.style.display = (drop.style.display === "flex") ? "none" : "flex";
}

function closeDropdown() {
  document.getElementById("dropdownOSINT").style.display = "none";
}

document.addEventListener("click", function(e) {
  const drop = document.getElementById("dropdownOSINT");
  const target = e.target;
  if (!target.closest(".dropdown")) {
    drop.style.display = "none";
  }
});

function showSection(id) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'flex';
}

function lookup() {
  const query = document.getElementById("search").value.trim();
  const resultBox = document.getElementById("result");
  if (!query) return resultBox.innerText = "⚠️ Merci d'entrer un terme valide.";
  resultBox.innerText = "⏳ Recherche...";
  fetch("100K_JOUEUR_FIVEM.txt")
    .then(res => res.ok ? res.text() : Promise.reject("Fichier introuvable."))
    .then(text => {
      const lines = text.split("\n");
      const matches = lines.map((line, i) =>
        line.toLowerCase().includes(query.toLowerCase()) ? `[Ligne ${i + 1}] : ${line}` : null
      ).filter(Boolean);
      if (matches.length > 0) {
        resultBox.innerText = matches.join("\n") + "\n\n✔ Copié.";
        navigator.clipboard.writeText(matches.join("\n"));
      } else {
        resultBox.innerText = "❌ Aucun résultat.";
      }
    })
    .catch(err => resultBox.innerText = `❌ Erreur : ${err}`);
}

function lookupIP() {
  const ip = document.getElementById("ipInput").value.trim();
  const box = document.getElementById("ipResult");
  if (!ip) return box.innerText = "⚠️ Entrez une IP.";
  box.innerText = "⏳ Recherche IP...";
  fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${API_KEYS.IP}&ip_address=${ip}`)
    .then(res => res.json())
    .then(data => {
      box.innerText = `🌍 Résultat :
- Pays : ${data.country || "?"}
- Ville : ${data.city || "?"}
- Région : ${data.region || "?"}
- FAI : ${data.connection?.isp_name || "?"}
- Type : ${data.connection?.connection_type || "?"}`;
    })
    .catch(() => box.innerText = "❌ Erreur IP.");
}

function lookupPhone() {
  const number = document.getElementById("numInput").value.trim();
  const box = document.getElementById("numResult");
  if (!number) return box.innerText = "⚠️ Entrez un numéro.";
  box.innerText = "⏳ Recherche numéro...";
  fetch(`http://apilayer.net/api/validate?access_key=${API_KEYS.PHONE}&number=${number}`)
    .then(res => res.json())
    .then(data => {
      if (data.valid) {
        box.innerText = `📞 Résultat :
- Pays : ${data.country_name || "?"}
- Code : +${data.country_code || "?"}
- Opérateur : ${data.carrier || "?"}
- Type : ${data.line_type || "?"}`;
      } else {
        box.innerText = "❌ Numéro invalide.";
      }
    })
    .catch(() => box.innerText = "❌ Erreur numéro.");
}

function lookupEmail() {
  const email = document.getElementById("emailInput").value.trim();
  const box = document.getElementById("emailResult");
  if (!email) return box.innerText = "⚠️ Entrez un email.";
  box.innerText = "⏳ Vérification email...";
  fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEYS.EMAIL}&email=${email}`)
    .then(res => res.json())
    .then(data => {
      box.innerText = `📧 Résultat :
- Valide : ${data.is_valid_format?.value ? "✅" : "❌"}
- MX : ${data.mx_found ? "✅" : "❌"}
- SMTP : ${data.is_smtp_valid?.value ? "✅" : "❌"}
- Deliverable : ${data.deliverability || "?"}
- Suggestion : ${data.autocorrect || "Aucune"}`;
    })
    .catch(() => box.innerText = "❌ Erreur email.");
}

function lookupIBAN() {
  const iban = document.getElementById("ibanInput").value.trim();
  const box = document.getElementById("ibanResult");
  if (!iban) return box.innerText = "⚠️ Entrez un IBAN.";
  box.innerText = "⏳ Vérification IBAN...";
  fetch(`https://ibanvalidation.abstractapi.com/v1/?api_key=${API_KEYS.IBAN}&iban=${iban}`)
    .then(res => res.json())
    .then(data => {
      box.innerText = `🏦 Résultat :
- IBAN valide : ${data.valid ? "✅" : "❌"}
- Banque : ${data.bank_data?.bank_name || "?"}
- Code BIC : ${data.bank_data?.bic || "?"}
- Pays : ${data.country || "?"}`;
    })
    .catch(() => box.innerText = "❌ Erreur IBAN.");
}

function lookupVAT() {
  const vat = document.getElementById("vatInput").value.trim();
  const box = document.getElementById("vatResult");
  if (!vat) return box.innerText = "⚠️ Entrez un numéro de TVA.";
  box.innerText = "⏳ Vérification TVA...";
  fetch(`https://vat-validation.abstractapi.com/v1/?api_key=${API_KEYS.VAT}&vat_number=${vat}`)
    .then(res => res.json())
    .then(data => {
      box.innerText = `🧾 Résultat :
- Valide : ${data.valid ? "✅" : "❌"}
- Pays : ${data.country || "?"}
- Société : ${data.company_name || "?"}
- Adresse : ${data.company_address || "?"}`;
    })
    .catch(() => box.innerText = "❌ Erreur TVA.");
}
