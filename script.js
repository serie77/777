class CardMachine {
    constructor() {
        this.cards = document.querySelectorAll('.poker-card');
        this.dealButton = document.getElementById('dealButton');
        this.entranceSection = document.getElementById('entranceSection');
        this.mainSite = document.getElementById('mainSite');
        this.copyButton = document.getElementById('copyBtn');
        this.contractValue = document.getElementById('contractValue');
        this.divineCards = document.querySelectorAll('.divine-card[data-flippable="true"]');
        
        this.isAnimating = false;
        this.symbols = ['7', 'A', 'K', 'Q', 'J', '10', '9', '8'];
        this.suits = ['♠', '♥', '♦', '♣'];
        
        this.bindEvents();
        this.initEffects();
    }
    
    bindEvents() {
        this.dealButton.addEventListener('click', () => this.startAnimation());
        if (this.copyButton) {
            this.copyButton.addEventListener('click', () => this.copyToClipboard());
        }
        
        // Add flip functionality to divine cards
        this.divineCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }
    
    initEffects() {
        // Add hover effects to cards
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isAnimating) {
                    card.style.transform = 'translateY(-10px) rotateY(10deg) rotateX(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isAnimating) {
                    card.style.transform = '';
                }
            });
        });
        
        // Add glow effect to 777 numbers
        const sevens = document.querySelectorAll('.seven');
        sevens.forEach((seven, index) => {
            seven.addEventListener('mouseenter', () => {
                seven.style.filter = 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 80px rgba(212, 175, 55, 0.5))';
                seven.style.transform = `scale(1.1) ${index === 0 ? 'rotateY(-20deg)' : index === 2 ? 'rotateY(20deg)' : 'scale(1.15)'}`;
            });
            
            seven.addEventListener('mouseleave', () => {
                seven.style.filter = '';
                seven.style.transform = '';
            });
        });
    }
    
    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.dealButton.disabled = true;
        this.dealButton.querySelector('.btn-text').textContent = 'REVEALING DESTINY...';
        
        // Start spinning cards
        this.cards.forEach((card, index) => {
            setTimeout(() => this.spinCard(card, index), index * 100);
        });
        
        // Settle cards after spinning
        setTimeout(() => this.settleCards(), 2000);
    }
    
    spinCard(card, index) {
        card.classList.add('spinning');
        const face = card.querySelector('.card-face');
        const suit = card.querySelector('.card-suit');
        
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            face.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            suit.textContent = this.suits[Math.floor(Math.random() * this.suits.length)];
            
            if (suit.textContent === '♥' || suit.textContent === '♦') {
                suit.style.color = '#dc143c';
            } else {
                suit.style.color = '';
            }
            
            spinCount++;
            if (spinCount > 15) {
                clearInterval(spinInterval);
            }
        }, 100);
    }
    
    settleCards() {
        this.cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('spinning');
                
                const face = card.querySelector('.card-face');
                const suit = card.querySelector('.card-suit');
                face.textContent = '7';
                
                const suits = ['♠', '♥', '♦'];
                suit.textContent = suits[index];
                
                if (suit.textContent === '♥' || suit.textContent === '♦') {
                    suit.style.color = '#dc143c';
                } else {
                    suit.style.color = '';
                }
            }, index * 200);
        });
        
        setTimeout(() => this.showWin(), 1000);
    }
    
    showWin() {
        this.cards.forEach(card => {
            card.classList.add('winning');
        });
        
        setTimeout(() => this.transitionToMainSite(), 2000);
    }
    
    transitionToMainSite() {
        this.entranceSection.classList.add('fade-out');
        
        setTimeout(() => {
            this.entranceSection.style.display = 'none';
            this.mainSite.classList.add('visible');
        }, 1000);
    }
    
    copyToClipboard() {
        const text = this.contractValue.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            const originalText = this.copyButton.querySelector('span').textContent;
            this.copyButton.querySelector('span').textContent = 'COPIED!';
            
            setTimeout(() => {
                this.copyButton.querySelector('span').textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CardMachine();
}); 