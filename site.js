function clickStart() {
    const listaTotal = document.querySelector("#casasBingo").value.split("\n");
    const qtdCartelas = parseInt(document.querySelector("#qtdCartelas").value, 0);
    const nomeBingo = document.querySelector("#nomeBingo").value;
    const imgCartela = document.querySelector("#imgCartela").value;

    if (!listaTotal || listaTotal.length < 30) {
        alert("É necessário uma lista de, pelo menos, 30 items!");
        return;
    }

    const gen = new Gerador(listaTotal, imgCartela);
    const out = document.querySelector("#output");
    out.innerHTML = "";
    for (let i = 0; i < qtdCartelas; i++) {
        var t = new Cartela(nomeBingo, gen.GerarCartela());
        out.append(t.genNode());
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

class Gerador {
    constructor(lista, imagem) {
        this.max = lista.length - 1;
        this.listaBase = [];
        for (let item of lista) {
            this.listaBase.push(new CasaCartela(item.trim()));
        }
        imagem = imagem ? imagem : 'passaros.png';
        this.casaImagem = new CasaCartela(null, imagem);
    }

    GerarCartela = function () {
        let usada = [];
        let i = 0;
        let retorno = [];
        let j;

        while (i < 25) {
            if (i == 12) {
                i++;
                continue;
            }

            do {
                j = getRandomInt(0, this.max);
            } while (usada[j] === true);

            usada[j] = true;
            retorno.push(this.listaBase[j]);
            i++;
        }
        // ordenar os números
        retorno = retorno.sort((a, b) => parseInt(a.display, 10) - parseInt(b.display, 10));
        // incluir a casa da imagem no centro da cartela
        retorno.splice(12, 0, this.casaImagem);
        return retorno;
    }
}

class Cartela {
    constructor(_titulo, _casas) {
        this.titulo = _titulo;
        this.casas = [[], [], [], [], []];
        let i = 0;
        let j = 0;
        // cria a matriz bidimensional transposta para ordenar corretamente de cima para baixo
        for (let y = 0; y < 5; y++) {
            for (let x = y, c = 0; c < 5; x += 5, c++) {
                this.casas[i][j++] = _casas[x];
                if (j > 4) {
                    i++; j = 0;
                }

                if (i > 4)
                    break;
            }
        }
    }
}

Cartela.prototype.genNode = function () {
    let container = document.createElement("div");
    container.classList.add("cartela");
    container.innerHTML = `
        <h2 class="cartela-titulo">${this.titulo} </h2>
            <div class ="cartela-corpo">
            ${this.casas.map((item, i) => `
                <div class="cartela-linha">
                    ${item.map((casa, j) => `${casa.genTemplate()} `).join('')}
                </div>
            `).join('')}
        </div>`;
    return container;
}

class CasaCartela {
    constructor(valor, imagem) {
        this.display = valor != null ? valor : imagem;
        this.tipo = valor != null ? 1 : 2;
    }
}

CasaCartela.prototype.genTemplate = function () {
    if (this.tipo == 1)
        return `<div class="cartela-casa">${this.display} </div>`;
    else
        return `<div class ="cartela-casa cartela-casa-img"><img src='${this.display}' /></div>`;
}

document.addEventListener("DOMContentLoaded", function (event) {
    // gerando 90 números das casas 
    document.querySelector("#casasBingo").value = Array(90).fill().map((_, index) => index + 1).toString().split(',').join('\n');
});