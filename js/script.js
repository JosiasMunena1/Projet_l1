document.addEventListener('DOMContentLoaded', () => {
    // Animation de fondu pour le fond héroïque
    const fondHéroïque = document.querySelector('.fond-héroïque');
    if (fondHéroïque) {
        fondHéroïque.style.opacity = '0';
        let opacity = 0;
        const fadeIn = setInterval(() => {
            if (opacity < 1) {
                opacity += 0.1;
                fondHéroïque.style.opacity = opacity;
            } else {
                clearInterval(fadeIn);
            }
        }, 100);

        const boutonCta = fondHéroïque.querySelector('.bouton-cta');
        if (boutonCta) {
            boutonCta.addEventListener('click', () => {
                boutonCta.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    boutonCta.style.transform = 'scale(1)';
                }, 200);
            });
        }
    }

    // Animation des sections lors du défilement
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });

    // Gestion du panier
    let cart = [];
    const compteurPanier = document.getElementById('cart-count');
    const modalePanier = document.getElementById('cart-modal');
    const fermerModale = document.querySelector('.fermer-modale');
    const articlesPanier = document.querySelector('.articles-panier');
    const totalPanier = document.getElementById('cart-total');
    const validerPanier = document.getElementById('validate-cart');
    const modaleConfirmation = document.getElementById('confirmation-modal');
    const fermerConfirmation = document.querySelector('.fermer-confirmation');
    const boutonConfirmation = modaleConfirmation ? modaleConfirmation.querySelector('.bouton-cta') : null;

    // Ajouter au panier
    document.querySelectorAll('.ajouter-au-panier').forEach(button => {
        button.addEventListener('click', () => {
            const carteProduit = button.closest('.élément-menu');
            const id = carteProduit.getAttribute('data-id');
            const name = carteProduit.querySelector('h3').textContent;
            const priceText = carteProduit.querySelector('p strong').nextSibling.textContent.trim();
            const price = parseFloat(priceText.replace('€', '').replace(',', '.'));
            const notification = carteProduit.querySelector('.notification-panier');

            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            updateCart();
            notification.classList.add('afficher');
            setTimeout(() => notification.classList.remove('afficher'), 2000);
        });
    });

    // Mettre à jour l'affichage du panier
    function updateCart() {
        if (articlesPanier) {
            articlesPanier.innerHTML = '';
            let total = 0;
            cart.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)} €</td>
                    <td>${(item.price * item.quantity).toFixed(2)} €</td>
                    <td><button class="retirer-du-panier">Supprimer</button></td>
                `;
                articlesPanier.appendChild(row);
                total += item.price * item.quantity;
            });
            totalPanier.textContent = `${total.toFixed(2)} €`;
            compteurPanier.textContent = `Panier : ${cart.reduce((sum, item) => sum + item.quantity, 0)}`;
            validerPanier.disabled = cart.length === 0;
        }
    }

    // Supprimer un article du panier
    if (articlesPanier) {
        articlesPanier.addEventListener('click', (e) => {
            if (e.target.classList.contains('retirer-du-panier')) {
                const row = e.target.closest('tr');
                const name = row.cells[0].textContent;
                cart = cart.filter(item => item.name !== name);
                updateCart();
            }
        });
    }

    // Ouvrir la modale du panier
    if (compteurPanier) {
        compteurPanier.addEventListener('click', () => {
            modalePanier.style.display = 'block';
        });
    }

    // Fermer la modale du panier
    if (fermerModale) {
        fermerModale.addEventListener('click', () => {
            modalePanier.style.display = 'none';
        });
    }

    // Fermer la modale en cliquant à l'extérieur
    if (modalePanier) {
        window.addEventListener('click', (e) => {
            if (e.target === modalePanier) {
                modalePanier.style.display = 'none';
            }
        });
    }

    // Valider le panier
    if (validerPanier) {
        validerPanier.addEventListener('click', () => {
            if (cart.length > 0) {
                modalePanier.style.display = 'none';
                modaleConfirmation.style.display = 'block';
                cart = [];
                updateCart();
            }
        });
    }

    // Fermer la modale de confirmation
    if (fermerConfirmation) {
        fermerConfirmation.addEventListener('click', () => {
            modaleConfirmation.style.display = 'none';
        });
    }

    if (boutonConfirmation) {
        boutonConfirmation.addEventListener('click', () => {
            modaleConfirmation.style.display = 'none';
        });
    }

    // Fermer la modale de confirmation en cliquant à l'extérieur
    if (modaleConfirmation) {
        window.addEventListener('click', (e) => {
            if (e.target === modaleConfirmation) {
                modaleConfirmation.style.display = 'none';
            }
        });
    }

    // Gestion des filtres de catégorie
    const boutonsFiltres = document.querySelectorAll('.filtre-categorie');
    const elementsMenu = document.querySelectorAll('.élément-menu');

    boutonsFiltres.forEach(button => {
        button.addEventListener('click', () => {
            const categorie = button.getAttribute('data-categorie');

            // Mettre à jour l'état actif des boutons
            boutonsFiltres.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtrer les articles
            elementsMenu.forEach(element => {
                const elementCategorie = element.getAttribute('data-categorie');
                if (categorie === 'tous' || elementCategorie === categorie) {
                    element.style.display = 'block';
                    element.style.opacity = '0';
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    element.style.display = 'none';
                }
            });
        });
    });

    // Gestion du formulaire de contact
    const formulaireContact = document.getElementById('formulaire-contact');
    if (formulaireContact) {
        formulaireContact.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            alert(`Message envoyé !\nNom: ${name}\nEmail: ${email}\nMessage: ${message}`);
            formulaireContact.reset();
        });
    }
});