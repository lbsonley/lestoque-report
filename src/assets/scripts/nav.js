const nav = document.querySelector('[data-js="nav"]');
const navTrigger = nav.querySelector('[data-nav="trigger"');

const handleToggleNav = () => {
	nav.classList.toggle("nav--is-closed");
	nav.classList.toggle("nav--is-open");
};

navTrigger.addEventListener("click", handleToggleNav);
