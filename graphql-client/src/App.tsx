import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GRAPHQL_URL, GET_DICE_REQ, CREATE_USER, SEARCH_USER } from './functions';

function App() {
  const [dice, setDice] = useState<number[]>([]);
  const [id, setId] = useState('');
  const [createid, setcreateId] = useState('');
  const [username, setusername] = useState('');

  useEffect(() => {
    getDice();
  }, []);

  const getDice = () => {
    fetch(GRAPHQL_URL,GET_DICE_REQ)
    .then(r=>r.json())
    .then(data => {
      console.log('data returned:', data)
      console.log('rollDice:', data.data.rollDice)
      setDice(data.data.rollDice);
    });
  } 
  const createUser = () => {
    setcreateId('')
    fetch(GRAPHQL_URL,CREATE_USER)
    .then(r=>r.json())
    .then(data => {
      console.log('data returned:', data)
      setcreateId(data.data.createMessage.id);
    });
  } 
  
  const searchUser = (id:string) =>{
    setusername('');
    fetch(GRAPHQL_URL,SEARCH_USER(id))
    .then(r=>r.json())
    .then(data => {
      console.log('data returned:', data)
      setusername(data.data?.getMessage?.author || 'no hit');
    });
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + graphql</h1>
      <div className="card">
        <button onClick={() => getDice()}>
          redice now 
        </button>
      </div>
      <p className="read-the-docs">
        your dice is {dice.join(',')}
      </p>
      <div className="card">
        <button onClick={() => createUser()}>
          create user
        </button>
        {createid && 
          <p>
            your create user id is <code>{createid}</code>
          </p>
        }
      </div>
      <div className="card">
        <input placeholder='enter user id' onChange={(e)=>setId(e.target.value)} />
        <button onClick={() => searchUser(id)}>
          search user
        </button>
        {username &&  
          <p>
            ID:<code>{createid}</code>'s member is <strong>{username}</strong>
          </p>
        }
      </div>
    </>
  )
}

export default App
