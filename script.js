let todos = [];
let currentFilter = "all";
// ok tôi mô tả lại flow 1 lần nữa này khi mà mở ra mà có sẵn ở local storage thì biến nó thành array và render lên màn hình, còn khi user thay đổi array thì saveTodo sẽ biến nó thành string và lưu vào localStorage và render lên màn hình luôn
// User add todo → Array thay đổi (RAM) → saveTodos() (disk) → render() (RAM)
// Load todos from localStorage on page load
function loadTodos() {
  const saved = localStorage.getItem("todos");
  // saved = '[{"id":1,"text":"Buy milk","completed":false},...]'
  todos = saved ? JSON.parse(saved) : [];
  render();
}
// json parse thì ra 1 cái array nhiều object xong hiện 3 cái todo trên màn hình
// Save todos to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Add new todo
function addTodo(text) {
  if (!text.trim()) return;

  todos.push({
    id: Date.now(),
    text: text.trim(),
    completed: false,
  });

  saveTodos();
  render();
}
// lấy parameter ở dưới addevent nó sẽ đẩy 1 object vào trong cái array todos, xong array todos sẽ được lưu vào localStorage

// Toggle todo completion
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}
// tìm id của từng cái và đổi completed của nó thành true và render lên màn hình
// Delete todo
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}
//giữ lại những cái có id khác cái cần xoá
function editTodo(id) {
  const todo = todos.find((t) => t.id === id);
  const newText = prompt("Edit todo:", todo.text); // Quick solution

  if (newText && newText.trim()) {
    todo.text = newText.trim();
    saveTodos();
    render();
  }
}

// Get filtered todos
function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter((t) => !t.completed);
  }
  if (currentFilter === "completed") {
    return todos.filter((t) => t.completed);
  }
  return todos;
}
// nếu currentFilter mà là active thì lọc ra những cái true là !t.completed
// nếu ếu currentFilter mà là completed thì lọc ra những cái true là t.completed
// Render UI
function render() {
  const todoList = document.getElementById("todoList");
  const activeCount = document.getElementById("activeCount");
  const filtered = getFilteredTodos();

  // trả về todos nếu đang ở all

  // Update active count
  activeCount.textContent = todos.filter((t) => !t.completed).length;
  // lọc những cái chưa làm
  // Render todos
  if (filtered.length === 0) {
    todoList.innerHTML = '<div class="empty-state">No todos to show</div>';
    return;
  }

  todoList.innerHTML = filtered
    .map(
      (todo) => `
                <div class="todo-item">
                    <input type="checkbox" ${todo.completed ? "checked" : ""} 
                     onchange="toggleTodo(${todo.id})" />
                    <span class="todo-text ${
                      todo.completed ? "completed" : ""
                    }">${todo.text}</span>
                    <button class="edit-btn" onclick="editTodo(${
                      todo.id
                    })">Edit</button>
                    <button class="delete-btn" onclick="deleteTodo(${
                      todo.id
                    })">Delete</button>
                </div>
            `
    ) // tức là đoạn đấy sẽ thay đổi innerHTML của cái div todoList
    //cái input có cái toán tử kia là để thêm cái thuộc tính checked và onchange là khi check thì sẽ gọi hàm toggleTodo
    //cái span có toán tử là để thêm css
    //cái button có onclick để gọi hàm delete mỗi khi click
    .join("");
}

// Event listeners
document.getElementById("addBtn").addEventListener("click", () => {
  const input = document.getElementById("todoInput");
  addTodo(input.value);
  input.value = "";
  input.focus();
});
// kiểu khi bấm vào thì nó lưu giá trị ở trong input xong nó sẽ cho nó quay về lại trống

document.getElementById("todoInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const input = document.getElementById("todoInput");
    addTodo(input.value);
    input.value = "";
    input.focus();
  }
});
// để user có thể ấn enter

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentFilter = e.target.dataset.filter;
    render();
  });
});
// trả về currentFilter là 1 trong 3 cái kia sau khi bấm vào
// Initialize
loadTodos();
