// Menu script for mobile
const menuIcon = document.querySelector(".menu_icon");
const menu = document.querySelector(".menu_icon i");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuIcon) {
  menuIcon.addEventListener("click", (e) => {
    e.preventDefault();
    mobileMenu.classList.toggle("mobile-menu-active");
    if (mobileMenu.classList.contains("mobile-menu-active")) {
      menu.classList.remove("fa-bars");
      menu.classList.add("fa-xmark");
    } else {
      menu.classList.remove("fa-xmark");
      menu.classList.add("fa-bars");
    }
  });
}

// Sticky header and active section update
$(window).scroll(function () {
  if ($(this).scrollTop() > 1) {
    $(".header-area").addClass("sticky");
  } else {
    $(".header-area").removeClass("sticky");
  }

  // Update the active section in the header
  updateActiveSection();
});

// Smooth scroll for navigation links
$(".header ul li a").click(function (e) {
  e.preventDefault();

  var target = $(this).attr("href");

  if ($(target).hasClass("active-section")) {
    return;
  }

  if (target === "#home") {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      500
    );
  } else {
    var offset = $(target).offset().top - 40;

    $("html, body").animate(
      {
        scrollTop: offset,
      },
      500
    );
  }

  $(".header ul li a").removeClass("active");
  $(this).addClass("active");
  
  // Close mobile menu if open
  if (mobileMenu.classList.contains("mobile-menu-active")) {
    mobileMenu.classList.remove("mobile-menu-active");
    menu.classList.remove("fa-xmark");
    menu.classList.add("fa-bars");
  }
});
// Menu script for mobile
const menuIcon = document.querySelector(".menu_icon");
const menu = document.querySelector(".menu_icon i");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuIcon) {
  menuIcon.addEventListener("click", (e) => {
    e.preventDefault();
    mobileMenu.classList.toggle("mobile-menu-active");
    if (mobileMenu.classList.contains("mobile-menu-active")) {
      menu.classList.remove("fa-bars");
      menu.classList.add("fa-xmark");
    } else {
      menu.classList.remove("fa-xmark");
      menu.classList.add("fa-bars");
    }
  });
}

// Sticky header and active section update
$(window).scroll(function () {
  if ($(this).scrollTop() > 1) {
    $(".header-area").addClass("sticky");
  } else {
    $(".header-area").removeClass("sticky");
  }

  // Update the active section in the header
  updateActiveSection();
});

// Smooth scroll for navigation links
$(".header ul li a").click(function (e) {
  e.preventDefault();

  var target = $(this).attr("href");

  if ($(target).hasClass("active-section")) {
    return;
  }

  if (target === "#home") {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      500
    );
  } else {
    var offset = $(target).offset().top - 40;

    $("html, body").animate(
      {
        scrollTop: offset,
      },
      500
    );
  }

  $(".header ul li a").removeClass("active");
  $(this).addClass("active");
  
  // Close mobile menu if open
  if (mobileMenu && mobileMenu.classList.contains("mobile-menu-active")) {
    mobileMenu.classList.remove("mobile-menu-active");
    menu.classList.remove("fa-xmark");
    menu.classList.add("fa-bars");
  }
});

// Initial content revealing js
ScrollReveal({
  distance: "100px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal(".header a, .profile-photo, .about-content, .education", {
  origin: "left",
});
ScrollReveal().reveal(".header ul, .profile-text, .about-skills, .timeline", {
  origin: "right",
});
ScrollReveal().reveal(".project-title, .contact-title", {
  origin: "top",
});
ScrollReveal().reveal(".projects, .contact", {
  origin: "bottom",
});

// Contact form submission (assuming Google Sheets integration)
const form = document.querySelector('form[name="submitToGoogleSheet"]');
const msg = document.getElementById("msg");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // Replace with your actual Google Apps Script URL

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => {
        msg.innerHTML = "Message sent successfully";
        setTimeout(function () {
          msg.innerHTML = "";
        }, 5000);
        form.reset();
      })
      .catch((error) => console.error("Error!", error.message));
  });
}

function updateActiveSection() {
  var scrollPosition = $(window).scrollTop();

  // Checking if scroll position is at the top of the page
  if (scrollPosition === 0) {
    $(".header ul li a").removeClass("active");
    $(".header ul li a[href='#home']").addClass("active");
    return;
  }

  // Iterate through each section and update the active class in the header
  $("section").each(function () {
    var target = $(this).attr("id");
    var offset = $(this).offset().top;
    var height = $(this).outerHeight();

    if (
      scrollPosition >= offset - 40 &&
      scrollPosition < offset + height - 40
    ) {
      $(".header ul li a").removeClass("active");
      $(".header ul li a[href='#" + target + "']").addClass("active");
    }
  });
}