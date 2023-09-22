import { createContext, useEffect, useRef } from "react";
import "./App.css";
import { useState } from "react";
import Todos from "./components/Todos";
import TodoInput from "./components/TodoInput";
export const todosContext = createContext();
function App() {
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const todoRef = useRef(null);

  useEffect(() => {
    let canceled = false;
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => {
        if (!canceled) {
          setTodos(data.slice(0, 10));
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => (canceled = true);
  }, []);

  const handleCheck = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  const handleDelete = (id) => {
    const newArray = todos.filter((todo) => todo.id !== id);
    setTodos(newArray);
  };

  const handleEdit = (e) => {
    const newTodos = todos.map((todo) =>
      todo.id === editId ? { ...todo, title: e.target.value } : todo
    );
    setTodos(newTodos);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setTodos([
      ...todos,
      { title: todoRef.current.value, completed: false, id: todos.length + 1 },
    ]);
  };

  return (
    <todosContext.Provider
      value={{
        todos,
        editId,
        todoRef,
        handleCheck,
        handleDelete,
        handleEdit,
        setEditId,
        handleCreate,
      }}
    >
      <div className="App">
        <div className="todo-create">
          <TodoInput />
        </div>
        <div className="todo-wrapper">
          <Todos />
        </div>
      </div>
    </todosContext.Provider>
  );
}

export default App;
