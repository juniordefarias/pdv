

document.querySelector('#help-button').addEventListener('click', function(){
    document.querySelector('#help-text').classList.toggle('invisible')
})

function read(e) {
    if (e.keyCode == 13 && cod.value != '') {
        let ean = cod.value
        let qtd = Number(document.querySelector('#qtd').value)
        
        cod.value = ''
        document.querySelector('#qtd').value = 1

        return {ean: ean, qtd: qtd}

    } else if (e.keyCode == 106) {
        if (cod.value == '') {
            document.querySelector('#qtd').value = 1
        } else {
            document.querySelector('#qtd').value = cod.value
            cod.value = ''
        }
        //return {ean: '', qtd: ''}
    }
}

function getProduct(product) {
    if (product == undefined) {
        return
    }

    for (let i = 0; i < products.length; i++) {
        if (product.ean == products[i].ean) {

            let productGotten = {
                ean : products[i].ean,
                name : products[i].name,
                qtd : product.qtd,
                value : products[i].value,
                total : Number((product.qtd * products[i].value).toFixed(2))
            }

            lista.push(productGotten)
            return
        } 
    }

    window.alert('Produto não localizado!')
}

/*function viewProducts() {
    document.querySelector('#lista').innerHTML = ''

    for (let i = 0; i < lista.length; i++) {
        let item = document.createElement('li')
        item.style.fontSize = '0.75rem'
        item.innerText = `${lista[i].ean} - ${lista[i].name} - ${lista[i].qtd}UN - ${lista[i].value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} - ${lista[i].total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`

        document.querySelector('#lista').appendChild(item)
    }
}*/

function viewProducts() {
    let tbody = document.querySelector('#tbody')

    /*for(let i = 0; i < tbody.ariaRowSpan.length; i++) {
        tbody.deleteRow(0)
    }*/
    tbody.innerText = ''

    for (var i = 0; i < lista.length; i++) {
        let tr = tbody.insertRow()

        let td_ean = tr.insertCell()
        let td_name = tr.insertCell()
        let td_qtd = tr.insertCell()
        let td_value = tr.insertCell()
        let td_total =tr.insertCell()

        td_ean.innerText = lista[i].ean
        td_name.innerText = lista[i].name
        td_qtd.innerText = `${lista[i].qtd}UN`
        td_value.innerText = lista[i].value
        td_total.innerText = lista[i].total//.toFixed(2)
    }

    //let nfce__table = document.querySelector('.nfce__table')
    tbody.scrollTop = tbody.scrollHeight

    document.querySelector('#nfceTotal').innerText = `Quantidade de itens: ${lista.length}`
}

function viewTotal() {
    soma = 0
    for (let i = 0; i < lista.length; i++) {
        soma += lista[i].total
    }

    totalg = Number(soma).toFixed(2)
    
    let total = document.querySelector('#total')
    total.innerText = `${soma.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`
}

function viewRest() {
    soma = 0
    for (let i = 0; i < lista.length; i++) {
        soma += lista[i].total
    }

    restg = Number(soma).toFixed(2)

    let rest = document.querySelector('#rest')
    rest.innerText = `${soma.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`
}

/*function viewPayment() {
    //document.querySelector('#way')
    for (let i = 0; i < payments.length; i++) {
        let option = document.createElement('option')
        option.textContent = payments[i]
        document.querySelector('#way').append(option)
    }
}*/

function paymentCorrection(element) {
    document.querySelector(element).value = document.querySelector(element)[0].value
}

const payments = ['Dinheiro', 'Cartão', 'Pix']
for (let i = 0; i < payments.length; i++) {
        let option = document.createElement('option')
        option.textContent = payments[i]
        document.querySelector('#way').append(option)
}

const lista = []
var totalg 
var restg

function main(e) {
    //console.log(e.keyCode)
    if (e.keyCode != 106 && e.keyCode != 13) {
        return
    }

    if (e.keyCode == 13 && lista.length == 0) {
        document.querySelector('#change').innerText = 'R$ 0,00'
    }

    if (Number(document.querySelector('#qtd').value < 0)) {
        window.alert('Erro! Quantidade negativa é inválida!')
        document.querySelector('#qtd').value = 1
        document.querySelector('#cod').value = ''
        return
    }
    
    let productRead = read(e)

    getProduct(productRead)

    viewProducts()
    viewTotal()
    viewRest()
}



document.querySelector('#qtd').addEventListener('keydown', function(e){
    if (e.keyCode == 13) {
        document.querySelector('#cod').focus()
    }
})

var cod = document.querySelector('#cod')
cod.addEventListener('keydown', main)

function delProduct(e) {
    if (e.keyCode == 68) {
        var ean = Number(window.prompt('REMOVER PRODUTO\nDigite o código de barras:'))

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!MELHORAR A UX 
        for (let i = (lista.length - 1); i >= 0; i--) {
            if (ean == lista[i].ean) {
                lista.splice(i, 1)
                break
            }
        }
        
        viewProducts()
        viewTotal()
        viewRest()
    }
}

function disabled(element) {
    document.querySelector(element).disabled = true
}

function enabled(element) {
    document.querySelector(element).disabled = false
}

function closePurchase(e) {

    if (e.keyCode == 81) { 
        
        if (lista.length == 0) {
            window.alert('Não é possivel finalizar a compra: Nenhum produto computado!')
            return
        }
        //close the purchase
        document.querySelector('#qtd').value = ''
        disabled('#qtd')
        disabled('#cod')

        paymentCorrection('#way')  //<<<<<<<<<<<<<<--------------------------------------------
        enabled('#way')
        document.querySelector('#way').focus()

        enabled('#value')
    }
}

function openPurchase(e) {
    if (e.keyCode == 79) { //open the purchase
        document.querySelector('#way').disabled = true
        document.querySelector('#value').disabled = true

        document.querySelector('#qtd').disabled = false
        document.querySelector('#cod').disabled = false

        document.querySelector('#cod').focus()
    }
}

function options(e) {

    //console.log(e.keyCode)

    delProduct(e)
    
    closePurchase(e)

    openPurchase(e)
}

window.addEventListener('keydown', options)

document.querySelector('#way').addEventListener('keydown', function(e){
    if (e.keyCode == 13) {
        document.querySelector('#value').focus()
    }
})

function finish() {
    document.querySelector('#qtd').value = 1

    totalg = 0
    restg = 0
    lista.splice(0,lista.length)

    viewProducts()
    viewTotal()
    viewRest()

    document.querySelector('#way').disabled = true
    document.querySelector('#value').value = ''
    document.querySelector('#value').disabled = true

    document.querySelector('#qtd').disabled = false
    document.querySelector('#cod').disabled = false 

    document.querySelector('#cod').focus()

    window.alert('Compra finalizada!')
}

document.querySelector('#value').addEventListener('keydown', function(e){
    
    if (e.keyCode == 13) {

        if (document.querySelector('#value').value == '') {
            return
        }

        var paid = Number(document.querySelector('#value').value.replace(',','.'))
        //console.log(`paid is ${paid}`)

        if (paid < restg) {
            //console.log(`Valor pago: ${paid}`)

            restg = (restg - paid).toFixed(2)

            //console.log(`Resto ${restg}`)

            let rest = document.querySelector('#rest')
            rest.innerText = `${restg.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}` 

            document.querySelector('#value').value = ''

            document.querySelector('#way').focus()

        } else if (paid == restg) {

            /*console.log('compra finalizada, obg')
            console.log(`Valor pago: ${paid}`)
            console.log(`Resto ${restg}`)*/

           finish()

        } else /*if (paid > restg)*/ {
            
            restg = paid - restg

            let change = restg

            document.querySelector('#change').innerText = `${change.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`

            finish()
        }
    }
})

const products = [  
    {
        name: 'BISCOITO TRELOSO CHOCOLATE 130g',
        ean: 7896213000189,
        value: 1.79
    },{
        name: 'CUSCUZ VITAMILHO FLOCÃO 500G',
        ean: 7894000022147,
        value: 1.59
    }, {
        name: 'DETERGENTE LIQ YPÊ NEUTRO 500ML',
        ean: 7896098900208,
        value: 1.39
    }
]


