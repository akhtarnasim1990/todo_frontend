import React, { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdOutlineDoneOutline } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";

import "./TodoPage.css";

function TodoPage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const token = localStorage.getItem("user_auth_token");
  const config = {
    headers: { "x-access-token": token },
  };

  const errorHandler = async (error) => {
    console.log(error);
    if (!error.response) {
      toast.error(error.message);
    } else if (!error.response.data.success) {
      if (error.response.status === 401) {
        toast.warning("Session has expired.");
        localStorage.clear();
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    axios
      .get("http://localhost:8000/todos/getTodos", config)
      .then((response) => {
        if (response.data.success) {
          let fetchedTodos = response.data.data;
          let doneTodos = [];
          let notDoneTodos = [];
          doneTodos = fetchedTodos.filter((obj) => obj.isDone);
          notDoneTodos = fetchedTodos.filter((obj) => !obj.isDone);
          setTodos([...notDoneTodos, ...doneTodos]);
          setLoading(false);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  }, [navigate]);

  const handleAddTodo = () => {
    try {
      setDisabled(true);
      if (newTodo.trim() !== "") {
        axios
          .post("http://localhost:8000/todos/createTodo", { todo: newTodo }, config)
          .then((response) => {
            if (response.data.success) {
              toast.success(response.data.message);
              setTodos([response.data.data, ...todos]);
              setDisabled(false);
            }
          })
          .catch((error) => {
            errorHandler(error);
            setDisabled(false);
          });
        setNewTodo("");
      }
    } catch (error) {
      errorHandler(error);
      setDisabled(false);
    }
  };

  const handleDeleteTodo = (index, todo) => {
    try {
      setDisabled(true);
      const updatedTodos = todos.filter((_, i) => i !== index);
      axios
        .post("http://localhost:8000/todos/deleteTodo", { todo_id: todo._id }, config)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            setTodos(updatedTodos);
            setDisabled(false);
          }
        })
        .catch((error) => {
          errorHandler(error);
          setDisabled(false);
        });
    } catch (error) {
      errorHandler(error);
      setDisabled(false);
    }
  };

  const handleEditTodo = (index, todo) => {
    try {
      setDisabled(true);
      const updatedTodo = prompt("Edit the todo:", todos[index].todo);
      if (updatedTodo !== null) {
        const updatedTodos = [...todos];

        axios
          .post("http://localhost:8000/todos/updateTodo", { todo_id: todo._id, todo: updatedTodo }, config)
          .then((response) => {
            if (response.data.success) {
              toast.success(response.data.message);
              updatedTodos[index].todo = updatedTodo;
              setTodos(updatedTodos);
              setDisabled(false);
            }
          })
          .catch((error) => {
            errorHandler(error);
            setDisabled(false);
          });
      }
    } catch (error) {
      errorHandler(error);
      setDisabled(false);
    }
  };

  const handleDoneTodo = async (index, todo) => {
    let updatedTodos = [...todos];
    let doneTodos = [];
    let notDoneTodos = [];
    if (!updatedTodos[index].isDone) {
      updatedTodos[index].isDone = true;
      doneTodos = updatedTodos.filter((obj) => obj.isDone);
      notDoneTodos = updatedTodos.filter((obj) => !obj.isDone);
      updatedTodos = [...notDoneTodos, ...doneTodos];
    } else {
      updatedTodos[index].isDone = false;
      doneTodos = updatedTodos.filter((obj) => obj.isDone);
      notDoneTodos = updatedTodos.filter((obj) => !obj.isDone);
      updatedTodos = [...notDoneTodos, ...doneTodos];
    }
    if (todo._id) {
      await todoDoneHandler(todo._id, todo.isDone);
    }
    setTodos(updatedTodos);
  };

  const todoDoneHandler = async (id, done) => {
    try {
      setDisabled(true);
      axios
        .post("http://localhost:8000/todos/todoIsDone", { todo_id: id, isDone: done }, config)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
          }
        })
        .catch((error) => {
          errorHandler(error);
          setDisabled(false);
        });
    } catch (error) {
      errorHandler(error);
      setDisabled(false);
    }
  };

  const logoutHandler = () => {
    try {
      setDisabled(true);
      axios.get("http://localhost:8000/users/logout", config).then((response) => {
        if (response.data.success) {
          localStorage.clear();
          toast.success(response.data.message);
          setDisabled(false);
          navigate("/");
        }
      });
    } catch (error) {
      errorHandler(error);
      setDisabled(false);
    }
  };

  const logoutAllHandler = async () => {
    try {
      setDisabled(true);
      axios.get("http://localhost:8000/users/logoutAll", config).then((response) => {
        if (response.data.success) {
          localStorage.clear();
          toast.success(response.data.message);
          setDisabled(false);
          navigate("/");
        }
      });
    } catch (error) {
      await errorHandler(error);
      setDisabled(false);
    }
  };

  return (
    <div className="todo-page">
      <div className="header">
        <h2>Todo List</h2>
        <div>
          <button style={{ marginRight: "10px" }} onClick={!disabled ? () => logoutAllHandler() : null}>
            Logout All
          </button>
          <button onClick={!disabled ? () => logoutHandler() : null}>Logout</button>
        </div>
      </div>
      <div className="todo-form">
        <input
          type="text"
          placeholder="Enter a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
        />
        <button onClick={!disabled ? () => handleAddTodo() : null}>Add</button>
      </div>
      {loading ? (
        <div>Loading</div>
      ) : (
        <div className="todo-list">
          {todos.map((todo, index) => (
            <div className={`todo-item ${todo.isDone ? "todo-item-done" : ""}`} key={index}>
              <span>{todo.todo}</span>

              <div className="todo-actions">
                <span onClick={!disabled ? () => handleEditTodo(index, todo) : null}>
                  <AiFillEdit />
                </span>
                <span onClick={!disabled ? () => handleDeleteTodo(index, todo) : null}>
                  <AiFillDelete />
                </span>
                <span onClick={!disabled ? () => handleDoneTodo(index, todo) : null}>
                  <MdOutlineDoneOutline />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoPage;
