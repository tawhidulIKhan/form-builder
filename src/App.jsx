import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/main.scss';
import FormBuilderContent from './components/FormBuilderContent';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FormBuilderContent />
    </>
  )
}

export default App
