// ---------- load from localStorage ----------
let expenses = JSON.parse(localStorage.getItem("expenses")) || [
  {
    id: 1,
    name: "Taxi",
    amount: 30,
    category: "transport",
    date: "2025-10-10",
  },
  {
    id: 2,
    name: "Groceries",
    amount: 250,
    category: "food",
    date: "2025-10-09",
  },
  {
    id: 3,
    name: "Netflix Subscription",
    amount: 85,
    category: "subscriptions",
    date: "2025-10-05",
  },
  {
    id: 4,
    name: "Gym Membership",
    amount: 200,
    category: "health",
    date: "2025-10-01",
  },
  {
    id: 5,
    name: "Movie Ticket",
    amount: 60,
    category: "entertainment",
    date: "2025-09-28",
  },
  {
    id: 6,
    name: "Electricity Bill",
    amount: 320,
    category: "utilities",
    date: "2025-09-25",
  },
  {
    id: 7,
    name: "Internet Bill",
    amount: 200,
    category: "utilities",
    date: "2025-09-20",
  },
  { id: 8, name: "Coffee", amount: 25, category: "food", date: "2025-09-19" },
  {
    id: 9,
    name: "Bus Ticket",
    amount: 7,
    category: "transport",
    date: "2025-09-15",
  },
  {
    id: 10,
    name: "Book Purchase",
    amount: 90,
    category: "education",
    date: "2025-09-14",
  },
  {
    id: 11,
    name: "Birthday Gift",
    amount: 150,
    category: "gifts",
    date: "2025-09-10",
  },
  {
    id: 12,
    name: "Shoes",
    amount: 400,
    category: "clothes",
    date: "2025-09-07",
  },
  {
    id: 13,
    name: "Doctor Visit",
    amount: 180,
    category: "health",
    date: "2025-09-05",
  },
  {
    id: 14,
    name: "Water Bill",
    amount: 70,
    category: "utilities",
    date: "2025-09-03",
  },
  {
    id: 15,
    name: "Mobile Recharge",
    amount: 50,
    category: "utilities",
    date: "2025-09-01",
  },
  {
    id: 16,
    name: "Donation",
    amount: 100,
    category: "other",
    date: "2025-08-28",
  },
  {
    id: 17,
    name: "Laptop Charger",
    amount: 250,
    category: "other",
    date: "2025-08-20",
  },
  {
    id: 18,
    name: "Uber Ride",
    amount: 45,
    category: "transport",
    date: "2025-08-15",
  },
  {
    id: 19,
    name: "Dinner Out",
    amount: 180,
    category: "food",
    date: "2025-08-10",
  },
  {
    id: 20,
    name: "Online Course",
    amount: 400,
    category: "education",
    date: "2025-08-05",
  },
];
let updateId = null;
let activeCategory = "all";

// ---------- DOM ----------
const addBtn = document.getElementById("addBtn");
const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("name");
const expenseAmount = document.getElementById("amount");
const expenseCategory = document.getElementById("category");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const expenseTable = document.getElementById("expenseBody");
const emptyMessage = document.getElementById("emptyMessage");
const formTitle = document.getElementById("formTitle");
const totalRow = document.getElementById("totalRow");
const sort = document.getElementById("sort");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("search");
const clear = document.getElementById("clear");
const filterBtns = document.querySelectorAll(".filter-btn");

// ---------- EVENTS ----------
addBtn.addEventListener("click", showForm);
cancelBtn.addEventListener("click", cancelEdit);

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (updateId === null) addExpense();
  else updateExpense();
});

sort.addEventListener("change", () => renderExpenses(pipeline()));
searchInput.addEventListener("input", () => renderExpenses(pipeline()));
searchBtn.addEventListener("click", () => renderExpenses(pipeline()));

filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.filter;
    renderExpenses(pipeline());
  })
);

clear.addEventListener("click", () => {
  if (expenses.length === 0) return;
  const confirmed = confirm("Are you sure you want to clear all expenses?");
  if (!confirmed) return;
  expenses = [];
  saveToLocalStorage();
  renderExpenses();
});

// ---------- CORE ----------
function showForm() {
  expenseForm.style.display = "block";
  addBtn.style.display = "none";
}

function addExpense() {
  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value);
  const category = expenseCategory.value;

  if (!name || isNaN(amount) || !category) {
    alert("Please fill in all fields correctly.");
    return;
  }

  expenses.push({
    id: Date.now(),
    name,
    amount,
    category,
    date: new Date().toISOString(),
  });
  saveToLocalStorage();
  resetForm();
  renderExpenses(pipeline());
}

function updateExpense() {
  const expense = expenses.find((exp) => exp.id === updateId);
  if (!expense) return;
  expense.name = expenseName.value.trim();
  expense.amount = parseFloat(expenseAmount.value);
  expense.category = expenseCategory.value;
  expense.date = new Date().toISOString();
  updateId = null;
  saveToLocalStorage();
  resetForm();
  renderExpenses(pipeline());
}

function cancelEdit() {
  updateId = null;
  resetForm();
}

function resetForm() {
  expenseForm.style.display = "none";
  addBtn.style.display = "inline-block";
  expenseName.value = "";
  expenseAmount.value = "";
  expenseCategory.value = "";
}

// ---------- PIPELINE ----------
function pipeline() {
  let list = expenses.slice();
  const term = searchInput.value.trim().toLowerCase();

  if (activeCategory !== "all")
    list = list.filter((e) => e.category === activeCategory);

  if (term)
    list = list.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e.category.toLowerCase().includes(term) ||
        String(e.amount).includes(term)
    );

  const criteria = sort.value;
  list.sort((a, b) => {
    if (criteria === "az") return a.name.localeCompare(b.name);
    if (criteria === "za") return b.name.localeCompare(a.name);
    if (criteria === "lowhigh") return a.amount - b.amount;
    if (criteria === "highlow") return b.amount - a.amount;
    if (criteria === "oldest") return new Date(a.date) - new Date(b.date);
    return new Date(b.date) - new Date(a.date);
  });

  return list;
}

// ---------- RENDER ----------
function renderExpenses(list = expenses) {
  expenseTable.innerHTML = "";
  if (list.length === 0) {
    emptyMessage.style.display = "block";
    totalRow.textContent = "Total: 0 MAD";
    return;
  }
  emptyMessage.style.display = "none";

  list.forEach((exp) => {
    const tr = document.createElement("tr");
    ["name", "amount", "category", "date"].forEach((key) => {
      const td = document.createElement("td");
      td.textContent =
        key === "date" ? new Date(exp.date).toLocaleDateString() : exp[key];
      tr.appendChild(td);
    });

    const tdActions = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => {
      updateId = exp.id;
      showForm();
      expenseName.value = exp.name;
      expenseAmount.value = exp.amount;
      expenseCategory.value = exp.category;
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      if (!confirm("Delete this expense?")) return;
      expenses = expenses.filter((e) => e.id !== exp.id);
      saveToLocalStorage();
      renderExpenses(pipeline());
    };

    tdActions.append(editBtn, delBtn);
    tr.appendChild(tdActions);
    expenseTable.appendChild(tr);
  });

  const total = list.reduce((acc, e) => acc + e.amount, 0);
  totalRow.textContent = `Total: ${total} MAD`;
}

// ---------- STORAGE ----------
function saveToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// ---------- INIT ----------
renderExpenses(pipeline());
