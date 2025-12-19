function FilterButtons({ onChange }) {
  return (
    <div>
      <button onClick={() => onChange("active")}>Active</button>
      <button onClick={() => onChange("completed")}>Completed</button>
    </div>
  );
}

export default FilterButtons;
