// import logo from './logo.svg';
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import functions from './services/functions';
import "./styles/index.scss";
import { Row, Col, Container } from 'reactstrap';
import Ripple from 'react-ripples';
import NumberFormat from 'react-number-format';

function App() {

  const [usersData, setUsersData] = useState([]);
  const [cardRendered, setRender] = useState('Padrão');
  const [personSelected, setPersonSelected] = useState('');
  const [buttonActive, setButtonActive] = useState(false);
  const [name, setName] = useState(null);
  const [balance, setBalance] = useState(null);
  const [description, setDescription] = useState(null);

  const getData = async () => {
    const { getUsers } = functions;
    const data = await getUsers();
    setUsersData(data.accounts.reverse());
    // setRender('Visualizar');
    console.log(data);
  }
  useEffect(() => {

    getData();

  }, []);

  const sendData = async () => {
    const nameR = nameRef.current.value;
    const descriptionR = descriptionRef.current.value;
    const balanceR = balanceRef.current.value;
    console.log(nameR);
    const object = {
      id: personSelected.id,
      name: nameR,
      description: descriptionR,
      balance: balanceR,
    }
    const { putDebts } = functions;
    await putDebts(object).then((res) => {
      setPersonSelected(object);
    })
    await getData();
  }
  const addData = async () => {
    const nameR = nameRef.current.value;
    const descriptionR = descriptionRef.current.value;
    const balanceR = balanceRef.current.value;
    console.log(nameR);
    const object = {
      name: nameR,
      description: descriptionR,
      balance: balanceR,
    }
    const { addPerson } = functions;
    await addPerson(object).then(() => {
      setPersonSelected(object);
    }).then(() => {
      setRender('Visualizar');
    })
    await getData();
  }

  const deleteData = async (id) => {
    const { deletePerson } = functions;
    deletePerson(id);
    const newArr = usersData.filter((item) => item.id !== id);
    setUsersData(newArr);
    setPersonSelected(usersData[id + 1]);
    setRender('Padrão')
  }
  const renderView = (card, position) => {
    console.log(window.innerWidth);
    setPersonSelected(usersData[position]);
    // setPersonObject({ name: null, balance: null, description: null });
    const buttonsToRemove = document.getElementsByClassName("buttons-edit");
    const buttons = document.getElementsByClassName("buttons-view");
    const arrButtons = Array.from(buttons);
    const arrButtonsToRemove = Array.from(buttonsToRemove);
    if (window.innerWidth < 769) {
      const formDiv = document.getElementById("container-data");
      formDiv.scrollIntoView();
    }

    arrButtonsToRemove.forEach(function (button) {
      if (button.classList.contains("active")) {
        button.classList.remove("active");
        button.classList.add("inactive");
      }
    });
    console.log(arrButtons[position]);
    arrButtons.forEach(function (button) {
      if (button.classList.contains("active")) {
        button.classList.remove("active");
        button.classList.add("inactive");
      }
    });
    arrButtons[position].classList.remove("inactive");
    arrButtons[position].classList.add("active");
    setRender(card);
    setButtonActive(true);
  }

  const renderEdit = (card, position) => {
    setName(null);
    setBalance(null);
    setDescription(null);
    if (window.innerWidth < 769) {
      const formDiv = document.getElementById("container-data");
      formDiv.scrollIntoView();
    }
    setPersonSelected(usersData[position - 1]);
    // nameRef.current.focus();
    const buttonsToRemove = document.getElementsByClassName("buttons-view");
    const buttons = document.getElementsByClassName("buttons-edit");
    const arrButtons = Array.from(buttons);

    const arrButtonsToRemove = Array.from(buttonsToRemove);
    arrButtonsToRemove.forEach(function (button) {
      if (button.classList.contains("active")) {
        button.classList.remove("active");
        button.classList.add("inactive");
      }
    });

    arrButtons.forEach(function (button) {
      if (button.classList.contains("active")) {
        button.classList.remove("active");
        button.classList.add("inactive");
      }
    });
    arrButtons[position].classList.remove("inactive");
    arrButtons[position].classList.add("active");
    console.log(arrButtons[position]);
    setRender(card);
    setButtonActive(true);
  }

  const renderNew = () => {
    if (window.innerWidth < 769) {
      const formDiv = document.getElementById("container-data");
      formDiv.scrollIntoView();
    }
    setRender('Novo')
    setName(null);
    setBalance(null);
    setDescription(null);
    setPersonSelected(null);
  }
  const handleKeyName = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      descriptionRef.current.focus();
    } else {
      return
    }
  }

  const handleKeyDescription = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      balanceRef.current.focus();
    }
  }

  const handleKeyBalance = (e) => {
    if (e.nativeEvent.key === 'Enter' && cardRendered === 'Novo') {
      addData();
      setRender('Padrão')
    } else if (e.nativeEvent.key === 'Enter') {
      sendData();
      setPersonSelected(usersData[0])
      setRender('Padrão');
    } else {
      return;
    }
  }
  const handleName = (e) => {
    setName(e.target.value);
  }

  const handleDescription = (e) => {
    setDescription(e.target.value);
  }

  const handleBalance = (e) => {
    setBalance(e.target.value);
  }
  const nameRef = useRef();
  const descriptionRef = useRef();
  const balanceRef = useRef();

  return (
    <div className="main-container">
      <Container>
        <Row id="main-row" className="d-flex justify-content center">
          <Col id="names-column" sm="12" md="5">
            <div id="container-names">
              <div id="container-new">
                <h2 className="title">Novo devedor</h2>
                <div id="container-new-view">
                  {/* <li className="names" key={index}>{user.name}</li> */}
                  <Ripple onClick={() => renderNew()} className="buttons-edit">
                    Novo
                  </Ripple>
                </div>
              </div>
              <h1 className="title">Nomes</h1>
              {usersData.map((user, index) => (
                <div id="container-save-view">
                  <li className="names" key={index}>{user.name}</li>
                  <div id="container-buttons">
                    <Ripple id={`button-edit-${index}`} onClick={() => renderEdit('Editar', index + 1)} className="buttons-edit inactive">Editar</Ripple>
                    <Ripple id={`button-view-${index}`} className="buttons-view inactive" onClick={() => renderView('Visualizar', index)}>Visualizar</Ripple>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col id="data-column" sm="12" md="7">
            {
              cardRendered === 'Editar' &&
              <div id="container-data">
                <h1 className="title">Editar dados</h1>
                <div id="data-box">
                  <div id="data-name">
                    <h3>Nome</h3>
                    <input
                      onKeyUp={handleKeyName}
                      ref={nameRef}
                      name="name"
                      onChange={handleName}
                      value={name === null ? personSelected.name : name}
                      id="name-field"
                      placeholder="Igor Henrique"
                    />
                  </div>
                  <div id="data-description">
                    <h3>Descrição</h3>
                    <input
                      onKeyUp={handleKeyDescription}
                      ref={descriptionRef}
                      name="description"
                      onChange={handleDescription}
                      value={description === null ? personSelected.description : description}
                      id="name-field"
                      placeholder="Igor Henrique"
                    />
                  </div>
                  <div id="data-value">
                    <h3>Dívida</h3>
                    <NumberFormat
                      onKeyUp={handleKeyBalance}
                      getInputRef={balanceRef}
                      name="balance"
                      value={balance === null ? personSelected.balance : balance}
                      onChange={handleBalance}
                      id="name-field"
                      thousandSeparator={true}
                      prefix={'$'}
                    />
                  </div>
                  <div id="data-button">
                    <Ripple onClick={() => sendData()} id="button">Salvar</Ripple>
                    <Ripple onClick={() => deleteData(personSelected.id)} id="button-delete">Excluir</Ripple>
                  </div>
                </div>
              </div>
            }
            {
              cardRendered === 'Visualizar' &&
              <div id="container-data">
                <h1 className="title">Visualizar dados</h1>
                <div id="data-box">
                  <div id="data-name">
                    <h3>Nome</h3>
                    <div className="information-container">
                      <span>{personSelected.name}</span>
                    </div>
                  </div>
                  <div id="data-description">
                    <h3>Descrição</h3>
                    <div className="information-container">
                      <span>{personSelected.description}</span>
                    </div>
                  </div>
                  <div id="data-value-formatted">
                    <h3>Valor</h3>
                    <div className="information-container">
                      <NumberFormat
                        id="name-field"
                        value={personSelected.balance}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                      />
                      {/* <span>{personSelected.balance}</span> */}
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              cardRendered === 'Novo' &&
              <div id="container-data">
                <h1 className="title">Editar dados</h1>
                <div id="data-box">
                  <div id="data-name">
                    <h3>Nome</h3>
                    <input
                      onKeyUp={handleKeyName}
                      ref={nameRef}
                      name="name"
                      onChange={handleName}
                      value={name}
                      // value={name === null ? personSelected.name : name}
                      id="name-field"
                      placeholder="Igor Henrique"
                    />
                  </div>
                  <div id="data-description">
                    <h3>Descrição</h3>
                    <input
                      onKeyUp={handleKeyDescription}
                      ref={descriptionRef}
                      name="description"
                      onChange={handleDescription}
                      value={description}
                      // value={description === null ? personSelected.description : description}
                      id="name-field"
                      placeholder="Igor Henrique"
                    />
                  </div>
                  <div id="data-value">
                    <h3>Dívida</h3>
                    <NumberFormat
                      onKeyUp={handleKeyBalance}
                      getInputRef={balanceRef}
                      name="balance"
                      value={balance}
                      // value={balance === null ? personSelected.balance : balance}
                      onChange={handleBalance}
                      id="name-field"
                      thousandSeparator={true}
                      prefix={'$'}
                    />
                  </div>
                  <div id="data-button">
                    <Ripple onClick={() => addData()} id="button">Criar novo</Ripple>
                    {/* <Ripple onClick={() => deleteData(personSelected.id)} id="button-delete">Excluir</Ripple> */}
                  </div>
                </div>
              </div>
            }
            {
              cardRendered === 'Padrão' &&
              <div id="description-container">
                <h1 className="title">Tela padrão</h1>
                <div id="description-text-container">
                  <span id="description-text">Neste sistema você pode adicionar, visualizar, editar e excluir o cadastro de qualquer cliente</span>
                </div>
              </div>
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
