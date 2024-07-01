const typing = () => {

    const paragraph = document.getElementById('typing-paragraph__skills');

    let skills = [
        "data analysis",
        "data visualization",
        "policy research"
    ];

    var i = 0;
    var skillIndex = 0;
    var speed = 150; /* The speed/duration of the effect in milliseconds */
    var isDeleting = false;
    var deleteSpeed = 70; /* The speed/duration of the delete effect in milliseconds */
    var delayAfterTyping = 2000; /* Delay after typing all skills */
    var delayAfterDeleting = 500; /* Delay after deleting all skills */

    function typeWriter() {
        let txt = skills[skillIndex];
        
        if (isDeleting) {
            if (i > 0) {
                paragraph.innerHTML = txt.substring(0, i-1);
                i--;
                setTimeout(typeWriter, deleteSpeed);
            } else {
                isDeleting = false;
                skillIndex = (skillIndex + 1) % skills.length;
                setTimeout(typeWriter, delayAfterDeleting);
            }
        } else {
            if (i < txt.length) {
                paragraph.innerHTML += txt.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                isDeleting = true;
                setTimeout(typeWriter, delayAfterTyping);
            }
        }
    }

    typeWriter();
}

export default typing;