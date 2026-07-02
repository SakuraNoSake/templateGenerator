import { initDOU } from './products/dou/index.js';
import { initSchool } from './products/school/index.js';
import { initSPO } from './products/spo/index.js';
import { initContingent } from './products/contingent/index.js';
import { pageTitles, pageSubtitles } from './config/config.js';

function switchForm(formId) {
    const navLinks = document.querySelectorAll('.nav-link');
    const formContainers = document.querySelectorAll('.form-container');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    navLinks.forEach(link => {
        if (link.getAttribute('data-form') === formId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    formContainers.forEach(container => {
        if (container.id === `${formId}Form`) {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    });

    if (pageTitles[formId]) {
        pageTitle.textContent = pageTitles[formId];
        pageSubtitle.textContent = pageSubtitles[formId];
    }

    localStorage.setItem('selectedForm', formId);

    initCurrentProduct(formId);
}

function initCurrentProduct(productType) {
    switch(productType) {
        case 'dou':
            initDOU();
            break;
        case 'school':
            initSchool();
            break;
        case 'spo':
            initSPO();
            break;
        case 'contingent':
            initContingent();
            break;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchForm(this.getAttribute('data-form'));
        });
    });

    const savedForm = localStorage.getItem('selectedForm') || 'dou';
    switchForm(savedForm);
});