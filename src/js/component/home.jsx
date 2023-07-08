import React, { useState, useEffect } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const apiUrl = "https://assets.breatheco.de/apis/fake/todos/user/archmyth";

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        await createUserList();
      } else {
        const tasksData = await response.json();
        setTodos(tasksData);
        console.log("Fetched tasks:", tasksData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createUserList = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([]),
      });

      if (!response.ok) {
        throw new Error("Failed to create user list");
      }

      console.log("User list created successfully");
      await fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async () => {
    if (inputValue === "") return;
    const newTodo = {
      label: inputValue,
      done: false,
    };
    const updatedTodos = [...todos, newTodo];
    try {
      await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodos),
      });
      setTodos(updatedTodos);
      setInputValue("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (index) => {
    const updatedTodos = todos.filter((_, currentIndex) => currentIndex !== index);

    try {
      let response;
      if (updatedTodos.length) {
        response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodos),
        });
      } else {
        response = await fetch(apiUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error deleting todo");
        }

        response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([]),
        });

        if (!response.ok) {
          throw new Error("Error creating user");
        }
      }

      if (response.ok) {
        setTodos(updatedTodos);
      } else {
        console.error("Error deleting todo:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const deleteAllTodos = async () => {
    try {
      await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([]),
      });

      setTodos([]); // Set todos to an empty array
    } catch (error) {
      console.error("Error deleting all todos:", error);
    }
  };

  return (
    <div className="container">
      <h1>My Todos</h1>
      <ul>
        <li>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
            placeholder="What do you need to do?"
          />
        </li>
        {todos.length === 0 ? (
          <p>No tasks, add a task</p>
        ) : (
          todos.map((todo, index) => (
            <li key={index}>
              {todo.label}
              <i
                className="fas fa-trash-alt"
                onClick={() => deleteTodo(index)}
              ></i>
            </li>
          ))
        )}
      </ul>
      <div>{todos.length} tasks</div>
	  <div>{todos.length ? `${todos.length} tasks to do` : "Add tasks!!"}</div>
      <button className="deleteAllButton" onClick={deleteAllTodos}>
        Delete All
      </button>
    </div>
  );
};

export default Home;
