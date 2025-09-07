/*console.log("ola JavaScript")
alert("alerta em JavaScript")*/

/*const nome = "sthevan";
let idade = 18;
const aprovado = true;

console.log(nome, idade, idade)*/

/*console.log(5 + 5);
console.log("2" + 2);
console.log(Number("2") + 2);*/

/*(const nota = 7.5;

if (nota >=7) {
    console.log("aprovado,nota:" + nota);
} else {
    console.log("reprovado, nota" + nota);
}*/

/*const frutas = ["maça", "abacate", "morango"];

    for(const fruta of frutas) {
        console.log(frutas);
    }*/

/*function soma(a, b) {
    return a + b;

}

const resultado = soma (10, 5);
console.log ("resultado: ", resultado);*/

/*const btn = document.getElementById("btn")
const msg = document.getElementById("msg")

btn.addEventListern("click", () =>{
    const hoje = new Date().toLocaleTimeString()
    msg.textContent = `Botão clicado as ${hoje}`
})*/

const m1 = document.getElementById("n1");
const m2 = document.getElementById("n2");
const somar = document.getElementById("somar");
const res = document.getElementById("res");

somar.addEventListener("click", () => {
    const a = Number(n1.value);
    const b = Number(n2.value);

    if (Number.isNaN(a) || Number.isNaN(b)){
        res.textContent = "Digite numero validos";
        return
    }

    res.textContent = a + b
})