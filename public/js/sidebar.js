const sidebar = document.getElementById("sidebar");
const toggleIcon = document.getElementById("toggleIcon");
const toggleArrow = document.getElementById("toggleArrow");

toggleIcon.addEventListener("click", () => {
  sidebar.classList.toggle("expanded");
  if (sidebar.classList.contains("expanded")) {
    toggleArrow.classList.remove("fa-angle-double-right");
    toggleArrow.classList.add("fa-angle-double-left");
  } else {
    toggleArrow.classList.remove("fa-angle-double-left");
    toggleArrow.classList.add("fa-angle-double-right");
  }
});
const container = document.querySelector('.dashboard-container');

function toggleSidebar() {
  sidebar.classList.toggle('expanded');
  container.classList.toggle('expanded-sidebar');
  container.classList.toggle('sidebar');
}