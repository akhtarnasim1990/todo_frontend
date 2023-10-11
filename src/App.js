import React from "react";
import LoginForm from "./pages/LoginForm";
import TodoPage from "./pages/TodoPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/todolist" element={<TodoPage />} />
      </Routes>
    </div>
  );
}

export default App;
