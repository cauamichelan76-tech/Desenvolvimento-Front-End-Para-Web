// Troque pelo endereço do seu formulário em formspree.io (ex.: https://formspree.io/f/abcdwxyz)
const FORM_ENDPOINT = "https://formspree.io/f/SEU_ID_AQUI";

const $ = s => document.querySelector(s);
const dig = v => v.replace(/\D/g, "");

const mask = {
  cpf: v => dig(v).slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
  tel: v => { v = dig(v).slice(0, 11); return v.length > 10 ? v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3"); },
  cep: v => dig(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2")
};

function cpfOk(c) {
  c = dig(c);
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  for (let t = 9; t < 11; t++) {
    let s = 0;
    for (let i = 0; i < t; i++) s += c[i] * (t + 1 - i);
    if ((s * 10 % 11) % 10 != c[t]) return false;
  }
  return true;
}

function setErr(id, msg) {
  $("#err-" + id).textContent = msg;
  $("#" + id).setAttribute("aria-invalid", msg ? "true" : "false");
}

function show(msg, cls) {
  const st = $("#status");
  st.className = cls;
  st.textContent = msg;
}

const f = $("#cadastro");
if (f) {
  f.querySelectorAll("[data-mask]").forEach(i =>
    i.addEventListener("input", () => (i.value = mask[i.dataset.mask](i.value))));

  // Integração 1: ViaCEP preenche o endereço a partir do CEP
  $("#cep").addEventListener("blur", async () => {
    const c = dig($("#cep").value);
    if (c.length !== 8) return;
    try {
      const d = await (await fetch(`https://viacep.com.br/ws/${c}/json/`)).json();
      if (d.erro) return setErr("cep", "CEP não encontrado. Confira os números.");
      setErr("cep", "");
      $("#endereco").value = [d.logradouro, d.bairro].filter(Boolean).join(" - ");
      $("#cidade").value = d.localidade;
      $("#estado").value = d.uf;
    } catch {
      setErr("cep", "Não foi possível buscar o CEP agora. Preencha o endereço à mão.");
    }
  });

  // Integração 2: validação de CPF e envio por Formspree
  f.addEventListener("submit", async e => {
    e.preventDefault();
    if (!cpfOk($("#cpf").value)) return setErr("cpf", "CPF inválido. Confira os números.");
    setErr("cpf", "");
    const data = Object.fromEntries(new FormData(f));
    data.areas = [...f.querySelectorAll("[name=areas]:checked")].map(c => c.value).join(", ");
    show("Enviando…", "ok");
    try {
      if (FORM_ENDPOINT.includes("SEU_ID")) {
        const l = JSON.parse(localStorage.getItem("voluntarios") || "[]");
        l.push(data);
        localStorage.setItem("voluntarios", JSON.stringify(l));
        show("Modo teste: o cadastro foi salvo só neste navegador. Configure FORM_ENDPOINT em script.js para receber os cadastros por e-mail.", "ok");
      } else {
        const r = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data)
        });
        if (!r.ok) throw new Error();
        show("Cadastro enviado. Entraremos em contato em breve.", "ok");
      }
      f.reset();
    } catch {
      show("Não foi possível enviar o cadastro. Tente de novo ou fale conosco pelo WhatsApp.", "bad");
    }
  });
}

// Integração 3: copiar a chave Pix
const pix = $("#copiar-pix");
if (pix) pix.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#chave-pix").textContent.trim());
    pix.textContent = "Chave copiada";
  } catch {
    pix.textContent = "Selecione e copie a chave";
  }
});
