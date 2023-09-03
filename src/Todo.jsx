import { FaRegTrashAlt } from "react-icons/fa";

const style = {
  li: `flex justify-between capitalize bg-slate-200 my-2 rounded-md p-4`,
  liComplete: `flex justify-between capitalize bg-slate-400 my-2 rounded-md p-4`,
  row: `flex`,
  text: `cursor-pointer ml-2`,
  textComplete: `cursor-pointer line-through ml-2`,
  button: `flex items-center cursor-pointer`,
};

const Todo = ({ todo, toggleComplete, deleteTodo }) => {
  return (
    <li className={todo.completed ? style.liComplete : style.li}>
      <div className={style.row}>
        <input
          onChange={() => toggleComplete(todo)}
          type="checkbox"
          checked={todo.completed ? "checked" : ""}
        />
        <p
          onClick={() => toggleComplete(todo)}
          className={todo.completed ? style.textComplete : style.text}
        >
          {todo.text}
        </p>
      </div>
      <button onClick={() => deleteTodo(todo.id)}>{<FaRegTrashAlt />}</button>
    </li>
  );
};

export default Todo;
