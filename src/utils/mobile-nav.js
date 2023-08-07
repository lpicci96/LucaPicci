const mobileNav = () => {

    const headerBtn = document.querySelector('.header__mobile-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav__menu-link');

    let isMobileNavOpen = false;
    console.log(isMobileNavOpen);

    //logic for opening and closing the mobile nav
    headerBtn.addEventListener('click', () => {
        console.log('click')
        isMobileNavOpen =! isMobileNavOpen // toggle
        console.log(isMobileNavOpen)

        //if user clicks on the button, display the mobile nav
        if (isMobileNavOpen) {
            mobileNav.style.display = "flex"
        }
        //if user clicks on the button to close, hide the mobile nav
        else {
            mobileNav.style.display = "none"
        }
    })

    //logic for clicking on the links in the mobile nav
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            isMobileNavOpen =! isMobileNavOpen // toggle
            console.log(isMobileNavOpen)
            mobileNav.style.display = "none"
        })
    })
    

}   



export default mobileNav;