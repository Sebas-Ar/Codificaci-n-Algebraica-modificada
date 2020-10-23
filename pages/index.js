import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Footer from '../components/Footer'
import Swal from 'sweetalert2'


const Home = () => {

    const [activate, setActivate] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [alfabeto, setAlfabeto] = useState([]);
    const [numerosAlfabeto, setNumerosAlfabeto] = useState([]);
    const [base, setBase] = useState(0);
    const [numerosMensaje, setNumerosMensaje] = useState([]);
    const [numCodificar, setNumCodificar] = useState(0.0);
    const [L, setL] = useState(0);
    const [codificacion, setCodificacion] = useState('');

    const onChangeMensaje = (e) => {
        setMensaje(e.target.value)
    }

    useEffect(() => {
        let vectorMensaje = Array.from(mensaje)

        let sinRepeticiones = vectorMensaje.filter(function (item, index, array) {  // aplicamos la funcion .filter para seleccionar
            return array.indexOf(item) === index;                                   // los simbolos, ignorando las repeticiones
        })

        setAlfabeto(sinRepeticiones)
    }, [mensaje]);

    useEffect(() => {
        let nums = []

        for (let i = 0; i < alfabeto.length; i++) {
            nums[i] = i
        }

        setNumerosAlfabeto(nums)

        if (alfabeto.length > 8) {

            setMensaje('')

            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Oops...',
                text: 'el mensaje no puede contenet más de 8 simbolos',
                showConfirmButton: false,
                timer: 2000
            })

        }
    }, [alfabeto]);

    useEffect(() => {

        let base = numerosAlfabeto[numerosAlfabeto.length - 1] + 1

        setBase(base)

    }, [numerosAlfabeto]);

    useEffect(() => {

        let numeros = []
        let arrayMensaje = Array.from(mensaje)

        for (let i = 0; i < arrayMensaje.length; i++) {
            for (let j = 0; j < alfabeto.length; j++) {
                if (arrayMensaje[i] === alfabeto[j]) {
                    numeros[i] = numerosAlfabeto[j]
                }
            }
        }

        setNumerosMensaje(numeros)

    }, [numerosAlfabeto])

    useEffect(() => {

        let numeroDecimal = "0."

        for (let i = 0; i < numerosMensaje.length; i++) {
            numeroDecimal += numerosMensaje[i]
        }

        setNumCodificar(parseFloat(numeroDecimal))
        
        if (mensaje !== '') {
            setActivate(true)  
        } else {
            setActivate(false)  
        }

        setL(numerosMensaje.length)
    }, [numerosMensaje]);

    useEffect(() => {

        let decimal = 0
        let num = '0.';

        for (let i = 0; i < numerosMensaje.length; i++) {
            decimal += numerosMensaje[i] * Math.pow(base, (-i - 1))
        }

        for (let i = 0; i < numerosMensaje.length; i++) {
            num += numerosMensaje[i]
        }
        
        let activo = 0
        let binario = '0.'
        let binario2Decimal = 0
        let decimal2Base = '0.'
        let cont = 0


        while (activo < 30) {

            binario += Math.trunc(decimal * 2)

            if (decimal*2 >= 1) {

                decimal = (decimal * 2) - 1

                for (let i = 2; i < binario.length; i++) {
                    binario2Decimal += binario[i] * Math.pow(2, (-i+1))
                    
                    let dec = binario2Decimal
                    let cuenta = 0

                    while (cuenta < 30) {

                        decimal2Base += Math.trunc(dec * base)
                        let entero = Math.trunc(dec * base)
                        dec = (dec * base) - entero

                        for (let j = 2; j < decimal2Base.length; j++) {

                            if (num[j] === decimal2Base[j]) {
                                cont++
                            } else {
                                cont--
                            }

                        }
                        if (cont === L - 1) {
                            if ( (dec * base) >= (num[L + 1] - 0.5)) {
                                decimal2Base += num[L + 1]
                                activo = 100
                                cuenta = 100
                            }
                        }
                        cont = 0
                        cuenta++
                    }

                    decimal2Base = '0.'
                }



            } else {
                decimal = decimal * 2
            }

            binario2Decimal = 0
            activo++
        }

        setCodificacion(binario)


    }, [L])


    return (
        <div className="container">

            <Head>
                <title>Codificación Algebráica Modificada</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>CODIFICACIÓN ALGEBRÁICA MODIFICADA</h1>

            <div className="content">

                <main>
                    <label>
                        Ingrese el mensaje a codificar: <br /><br />
                        <input type="text" onChange={onChangeMensaje} value={mensaje}/>
                    </label>

                    <p>{'Alfabeto : {' + alfabeto + '}'}</p>
                    <p>{'Numeros Alfabeto : {' + numerosAlfabeto + '}'}</p>
                    <p>{'Numeros Mensaje : {' + numerosMensaje + '}'}</p>
                    <p>{'L = ' + L}</p>
                </main>

                {
                    activate
                    ?
                        <main>
                            <div>
                                <h3>Número a codificar</h3>
                                <p>{numCodificar}<span> [{base ? base : ''}]</span></p>
                            </div>
                        </main>
                    :
                        ''
                }

                {
                    activate
                        ?
                        <main style={{gridColumn: '1/3'}}>
                            <div>
                                <h3>Codificación óptima</h3>
                                <p>{codificacion}</p>
                            </div>
                        </main>
                        :
                        ''
                }

            </div>


            <Footer />

            <style jsx>{`

                h1 {
                    color: white;
                    text-align: center;
                }

                .content {
                    display: grid; 
                    grid-template-columns: ${ activate ? '1fr 1fr' : '1fr'};
                }

                .container {
                    min-height: 100vh;
                    padding: 0 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                label {
                    display: grid;
                    justify-items: center;
                    color: white;
                }

                span {
                    font-size: 12px;
                }

                input {
                    height: 30px;
                    border-radius: 20px;
                    border: 1px solid #33333344;
                    padding: 10px;
                    outline: none;
                    text-align: center;
                }

                select {
                    padding: 0px 10px;
                }

                main {
                    padding: 5rem 0;
                    display: grid;
                    align-items: center;
                    justify-items: center;
                    border-radius: 30px;
                    margin: 10px;
                    padding: 30px;
                    background: #2C3E5044;
                }

                main > div {
                    color: white;
                    text-align: center;
                }

                :globla(body) {
                    background: linear-gradient(180deg, #bdc3c7 0%, #3B4371 100%);
                }

                p {
                    color: white;
                }

                button {
                    border: none;
                    padding: 10px 30px;
                    border-radius: 30px;
                    background-color: #528B90;
                    color: white;
                    cursor: pointer;
                    transition: background-color 1s;
                    outline: none;
                    margin: 16px 0;
                }

                button:hover {
                    background-color: #51A8A7;
                }

            `}</style>

            <style jsx global>{`

              html, body {
                  padding: 0;
                  margin: 0;
                  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                  Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
              }

              * {
                  box-sizing: border-box;
              }

      `}</style>

        </div>
    )
}

export default Home