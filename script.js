// 🎯 FDW Lookup - Script Complet Final
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

document.addEventListener("click", function (e) {
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

// 🔍 Lookup FiveM
function lookup() {
  const query = document.getElementById("search").value.trim();
  const resultBox = document.getElementById("result");
  if (!query) return resultBox.innerText = "⚠️ Merci d'entrer un terme valide.";
  resultBox.innerText = "⏳ Chargement fichiers...";

  const baseURL = window.location.origin + "/fdw/";

  Promise.all([
    fetch(baseURL + "fivem_part1.txt").then(r => r.text()),
    fetch(baseURL + "fivem_part2.txt").then(r => r.text())
  ])
    .then(([part1, part2]) => {
      const lines = (part1 + "\n" + part2).split("\n");
      const matches = lines.map((line, i) =>
        line.toLowerCase().includes(query.toLowerCase()) ? `🔎 [Ligne ${i + 1}] : ${line}` : null
      ).filter(Boolean);

      if (matches.length > 0) {
        const finalText = matches.join("\n");
        resultBox.innerText = finalText + "\n\n✔ Résultat copié.";
        resultBox.style.color = "#66ff99";
        navigator.clipboard.writeText(finalText);
      } else {
        resultBox.innerText = "❌ Aucun résultat trouvé.";
        resultBox.style.color = "#ff6666";
      }
    })
    .catch(err => {
      resultBox.innerText = `❌ Erreur de chargement : ${err}`;
      resultBox.style.color = "#ff6666";
    });
}

// 🌍 IP Lookup
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

// ✉️ lookphone
function lookupPhone() {
  const number = document.getElementById("numInput").value.trim();
  const box = document.getElementById("numResult");

  if (!number) {
    box.innerText = "⚠️ Entrez un numéro.";
    return;
  }

  box.innerText = "⏳ Recherche numéro...";

  fetch(`https://numvalidate.com/api/validate?number=${encodeURIComponent(number)}`)
    .then(res => {
      if (!res.ok) throw new Error("API indisponible");
      return res.json();
    })
    .then(data => {
      if (data.valid) {
        box.innerText = `📞 Résultat :
- Valide : ✅
- Numéro (E.164) : ${data.e164Format || data.number}
- National : ${data.internationalFormat || data.nationalFormat || "?"}
- Pays : ${data.countryName} (${data.countryCode})
- Indicatif : +${data.countryPrefix}`;
      } else {
        box.innerText = "❌ Numéro invalide.";
      }
    })
    .catch(err => {
      console.error(err);
      box.innerText = "❌ Erreur API ou limit.";
    });
}

// ✉️ Email
function lookupEmail() {
  const email = document.getElementById("emailInput").value.trim();
  const box = document.getElementById("emailResult");
  if (!email || !email.includes("@") || !email.includes(".")) {
    return box.innerText = "⚠️ Entrez un email valide (ex: exemple@mail.com).";
  }

  box.innerText = "⏳ Vérification email...";

  fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEYS.EMAIL}&email=${encodeURIComponent(email)}`)
    .then(res => {
      if (!res.ok) throw new Error("Erreur serveur.");
      return res.json();
    })
    .then(data => {
      if (!data || typeof data !== "object") {
        throw new Error("Réponse invalide.");
      }

      const isValid = data.is_valid_format?.value ?? false;
      const mxFound = data.mx_found ?? false;
      const smtpValid = data.is_smtp_valid?.value ?? false;
      const deliverable = data.deliverability || "Inconnu";
      const suggestion = data.autocorrect || "Aucune";

      box.innerText = `📧 Résultat :
- Valide : ${isValid ? "✅" : "❌"}
- MX : ${mxFound ? "✅" : "❌"}
- SMTP : ${smtpValid ? "✅" : "❌"}
- Deliverable : ${deliverable}
- Suggestion : ${suggestion}`;
    })
    .catch((err) => {
      box.innerText = `❌ Erreur email : ${err.message}`;
    });
}


// 🏦 IBAN
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

// 🧾 TVA
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

function lookupUsername() {
  const username = document.getElementById("userInput").value.trim();
  const box = document.getElementById("userResult");
  if (!username) return box.innerText = "⚠️ Entrez un pseudo.";
  box.innerText = "⏳ Recherche en cours...";

  const sites = [
    "https://github.com/", "https://twitter.com/", "https://instagram.com/", "https://tiktok.com/@",
    "https://facebook.com/", "https://reddit.com/user/", "https://pinterest.com/", "https://soundcloud.com/",
    "https://twitch.tv/", "https://medium.com/@", "https://dev.to/", "https://stackoverflow.com/users/",
    "https://steamcommunity.com/id/", "https://disqus.com/by/", "https://about.me/", "https://behance.net/",
    "https://bitbucket.org/", "https://buzzfeed.com/", "https://dribbble.com/", "https://flickr.com/people/",
    "https://flipboard.com/@", "https://gab.com/", "https://goodreads.com/user/show/", "https://hackerone.com/",
    "https://keybase.io/", "https://kongregate.com/accounts/", "https://last.fm/user/", "https://letterboxd.com/",
    "https://mixcloud.com/", "https://ok.ru/", "https://patreon.com/", "https://producthunt.com/@",
    "https://replit.com/@", "https://scratch.mit.edu/users/", "https://slideshare.net/", "https://snapchat.com/add/",
    "https://spotify.com/user/", "https://tripadvisor.com/Profile/", "https://tumblr.com/", "https://vsco.co/",
    "https://weheartit.com/", "https://youtube.com/@", "https://badoo.com/en/", "https://bandcamp.com/",
    "https://vk.com/", "https://newgrounds.com/", "https://ello.co/", "https://imgur.com/user/"
  ];

  let found = [];
  let checked = 0;
  let total = sites.length;
  box.innerText = `🔍 Test de ${total} sites...\n`;

  sites.forEach(site => {
    const url = site + username;
    fetch("https://corsproxy.io/?" + encodeURIComponent(url), { method: "GET" })
      .then(res => {
        checked++;
        if (res.status === 200) {
          found.push(url);
          box.innerText += `✅ Trouvé : ${url}\n`;
        } else {
          box.innerText += `❌ Introuvable : ${url}\n`;
        }
        if (checked === total) {
          box.innerText += `\n🎯 Résultats : ${found.length}/${total} plateformes.`;
          if (found.length > 0) {
            navigator.clipboard.writeText(found.join("\n"));
          }
        }
      })
      .catch(() => {
        checked++;
        box.innerText += `❌ Erreur (CORS ?) : ${url}\n`;
      });
  });
}


// 🧠 NazAPI général
function lookupNazAPI() {
  const input = document.getElementById("nazInput").value.trim();
  const box = document.getElementById("nazResult");
  if (!input) return box.innerText = "⚠️ Entrez une donnée.";
  box.innerText = "⏳ Analyse en cours...";

  fetch(`https://api.naz.api/lookup?query=${encodeURIComponent(input)}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        box.innerText = `🧠 Résultat NazAPI :
- Type : ${data.type || "?"}
- Résultat : ${data.result || "Aucun"}`;
      } else {
        box.innerText = "❌ Aucun résultat.";
      }
    })
    .catch(() => box.innerText = "❌ Erreur NazAPI.");
}
