/**
 * WineCalc - Blend Manager
 * Manages wine tanks and blend calculations
 */

class BlendManager {
    constructor() {
        this.tanks = [];
        this.currentTankId = null;
        this.STORAGE_KEY = 'winecalc_tanks';

        this.init();
    }

    init() {
        this.loadTanks();
        this.setupEventListeners();
        this.renderTanksList();
        this.updateBlendCalculator();
    }

    setupEventListeners() {
        // Add tank button
        document.getElementById('addTankBtn').addEventListener('click', () => {
            this.resetForm();
            this.scrollToForm();
        });

        // Cancel button
        document.getElementById('cancelTankBtn').addEventListener('click', () => {
            this.resetForm();
        });

        // Form submit with custom validation
        document.getElementById('tankForm').addEventListener('submit', (e) => {
            e.preventDefault();

            if (this.validateTankForm()) {
                this.saveTank();
            }
        });
    }

    // Local Storage Management
    loadTanks() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            this.tanks = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('[Blend] Error loading tanks:', error);
            this.tanks = [];
        }
    }

    saveTanksToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tanks));
        } catch (error) {
            console.error('[Blend] Error saving tanks:', error);
            this.showToast(WineCalcI18n.t('errors.saveFailed') || 'Errore nel salvataggio', 'danger');
        }
    }

    // Tank CRUD Operations
    validateTankForm() {
        // Get form fields
        const tankName = document.getElementById('tankName').value.trim();
        const tankCapacity = document.getElementById('tankCapacity').value;
        const tankVolume = document.getElementById('tankVolume').value;
        const alcoholPercent = document.getElementById('alcoholPercent').value;

        // Validate required fields
        if (!tankName) {
            this.showToast(WineCalcI18n.t('blend.validation.nameRequired') || 'Il nome della vasca è obbligatorio', 'warning');
            document.getElementById('tankName').focus();
            return false;
        }

        if (!tankCapacity || parseFloat(tankCapacity) <= 0) {
            this.showToast(WineCalcI18n.t('blend.validation.capacityRequired') || 'La capienza deve essere maggiore di zero', 'warning');
            document.getElementById('tankCapacity').focus();
            return false;
        }

        if (!tankVolume || parseFloat(tankVolume) <= 0) {
            this.showToast(WineCalcI18n.t('blend.validation.volumeRequired') || 'Il volume deve essere maggiore di zero', 'warning');
            document.getElementById('tankVolume').focus();
            return false;
        }

        if (!alcoholPercent || parseFloat(alcoholPercent) < 0 || parseFloat(alcoholPercent) > 20) {
            this.showToast(WineCalcI18n.t('blend.validation.alcoholRequired') || 'La gradazione alcolica deve essere tra 0 e 20%', 'warning');
            document.getElementById('alcoholPercent').focus();
            return false;
        }

        return true;
    }

    saveTank() {
        const tankData = this.getFormData();

        if (this.currentTankId) {
            // Update existing tank
            const index = this.tanks.findIndex(t => t.id === this.currentTankId);
            if (index !== -1) {
                this.tanks[index] = { ...tankData, id: this.currentTankId };
            }
        } else {
            // Add new tank
            tankData.id = this.generateId();
            this.tanks.push(tankData);
        }

        this.saveTanksToStorage();
        this.renderTanksList();
        this.updateBlendCalculator();
        this.resetForm();

        // Show success message
        this.showToast(WineCalcI18n.t('blend.tanks.saved') || 'Vasca salvata!');
    }

    deleteTank(id) {
        if (confirm(WineCalcI18n.t('blend.tanks.confirmDelete') || 'Eliminare questa vasca?')) {
            this.tanks = this.tanks.filter(t => t.id !== id);
            this.saveTanksToStorage();
            this.renderTanksList();
            this.updateBlendCalculator();
            this.resetForm();
        }
    }

    editTank(id) {
        const tank = this.tanks.find(t => t.id === id);
        if (!tank) return;

        this.currentTankId = id;
        this.populateForm(tank);
        this.scrollToForm();

        // Update form title
        document.getElementById('tankFormTitle').textContent =
            WineCalcI18n.t('blend.tankForm.edit') || 'Modifica Vasca';
        document.getElementById('saveTankBtnText').textContent =
            WineCalcI18n.t('blend.tankForm.update') || 'Aggiorna Vasca';
    }

    // Form Management
    getFormData() {
        return {
            name: document.getElementById('tankName').value,
            capacity: parseFloat(document.getElementById('tankCapacity').value),
            capacityUnit: document.getElementById('tankCapacityUnit').value,
            volume: parseFloat(document.getElementById('tankVolume').value),
            volumeUnit: document.getElementById('tankVolumeUnit').value,
            alcoholPercent: parseFloat(document.getElementById('alcoholPercent').value),
            totalAcidity: parseFloat(document.getElementById('totalAcidity').value) || null,
            pH: parseFloat(document.getElementById('pH').value) || null,
            residualSugars: parseFloat(document.getElementById('residualSugars').value) || null,
            freeSO2: parseFloat(document.getElementById('freeSO2').value) || null,
            totalSO2: parseFloat(document.getElementById('totalSO2').value) || null,
            notes: document.getElementById('tankNotes').value || ''
        };
    }

    populateForm(tank) {
        document.getElementById('tankId').value = tank.id;
        document.getElementById('tankName').value = tank.name;
        document.getElementById('tankCapacity').value = tank.capacity;
        document.getElementById('tankCapacityUnit').value = tank.capacityUnit;
        document.getElementById('tankVolume').value = tank.volume;
        document.getElementById('tankVolumeUnit').value = tank.volumeUnit;
        document.getElementById('alcoholPercent').value = tank.alcoholPercent;
        document.getElementById('totalAcidity').value = tank.totalAcidity || '';
        document.getElementById('pH').value = tank.pH || '';
        document.getElementById('residualSugars').value = tank.residualSugars || '';
        document.getElementById('freeSO2').value = tank.freeSO2 || '';
        document.getElementById('totalSO2').value = tank.totalSO2 || '';
        document.getElementById('tankNotes').value = tank.notes || '';
    }

    resetForm() {
        this.currentTankId = null;
        document.getElementById('tankForm').reset();
        document.getElementById('tankFormTitle').textContent =
            WineCalcI18n.t('blend.tankForm.add') || 'Aggiungi Vasca';
        document.getElementById('saveTankBtnText').textContent =
            WineCalcI18n.t('blend.tankForm.save') || 'Salva Vasca';
    }

    scrollToForm() {
        document.getElementById('tankForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Rendering
    renderTanksList() {
        const container = document.getElementById('tanksList');
        const emptyMessage = document.getElementById('emptyTanksMessage');

        if (this.tanks.length === 0) {
            emptyMessage.style.display = 'block';
            container.querySelectorAll('.list-group-item').forEach(item => item.remove());
            return;
        }

        emptyMessage.style.display = 'none';
        container.querySelectorAll('.list-group-item').forEach(item => item.remove());

        this.tanks.forEach(tank => {
            const item = this.createTankListItem(tank);
            container.appendChild(item);
        });
    }

    createTankListItem(tank) {
        const div = document.createElement('div');
        div.className = 'list-group-item list-group-item-action';

        const volumeInL = this.convertToLiters(tank.volume, tank.volumeUnit);
        const capacityInL = this.convertToLiters(tank.capacity, tank.capacityUnit);
        const fillPercent = (volumeInL / capacityInL * 100).toFixed(1);

        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${this.escapeHtml(tank.name)}</h6>
                    <small class="text-muted">
                        ${tank.volume} ${tank.volumeUnit} / ${tank.capacity} ${tank.capacityUnit}
                        (${fillPercent}%)
                    </small>
                    <div class="mt-1">
                        <span class="badge bg-primary">${tank.alcoholPercent}% vol</span>
                        ${tank.pH ? `<span class="badge bg-secondary">pH ${tank.pH}</span>` : ''}
                    </div>
                </div>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary edit-tank-btn" data-id="${tank.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger delete-tank-btn" data-id="${tank.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;

        // Event listeners
        div.querySelector('.edit-tank-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.editTank(tank.id);
        });

        div.querySelector('.delete-tank-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteTank(tank.id);
        });

        return div;
    }

    // Blend Calculator
    updateBlendCalculator() {
        const container = document.getElementById('blendCalculatorContent');

        if (this.tanks.length < 2) {
            container.innerHTML = `
                <i class="bi bi-info-circle" style="font-size: 3rem; opacity: 0.3;"></i>
                <p class="mt-3 mb-0" data-i18n="blend.calculator.needTanks">
                    Aggiungi almeno 2 vasche per calcolare un blend
                </p>
            `;
            return;
        }

        container.innerHTML = this.renderBlendCalculator();
        this.setupBlendCalculatorListeners();
    }

    renderBlendCalculator() {
        let html = `
            <form id="blendCalculatorForm">
                <div class="row mb-4">
                    <div class="col-12">
                        <h6 class="mb-3">${WineCalcI18n.t('blend.calculator.selectTanks') || 'Seleziona le vasche da miscelare'}</h6>
                    </div>
                </div>
                <div class="row">
        `;

        this.tanks.forEach(tank => {
            const maxVolume = this.convertToLiters(tank.volume, tank.volumeUnit);
            html += `
                <div class="col-md-6 mb-3">
                    <div class="card blend-tank-card" data-id="${tank.id}" style="cursor: pointer; transition: all 0.2s;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0 fw-bold">${this.escapeHtml(tank.name)}</h6>
                                <i class="bi bi-check-circle-fill text-success blend-selected-icon" style="display: none; font-size: 1.5rem;"></i>
                            </div>
                            <small class="text-muted d-block mb-2">
                                <i class="bi bi-bucket me-1"></i>
                                ${tank.volume} ${tank.volumeUnit} • ${tank.alcoholPercent}% vol
                            </small>
                            <div class="blend-tank-volume" style="display: none;">
                                <hr class="my-2">
                                <label class="form-label small mb-1">${WineCalcI18n.t('blend.calculator.volumeToUse') || 'Volume da usare (L)'}</label>
                                <input type="number" class="form-control form-control-sm blend-volume-input"
                                       data-id="${tank.id}" step="0.1" min="0" max="${maxVolume}"
                                       placeholder="Max: ${maxVolume} L" onclick="event.stopPropagation();">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div class="row mt-4">
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary-theme btn-lg w-100">
                            <i class="bi bi-calculator me-2"></i>
                            ${WineCalcI18n.t('blend.calculator.calculate') || 'Calcola Blend'}
                        </button>
                    </div>
                </div>
            </form>
            <div id="blendResults" class="mt-4" style="display: none;"></div>
        `;

        return html;
    }

    setupBlendCalculatorListeners() {
        // Card click listeners
        document.querySelectorAll('.blend-tank-card').forEach(card => {
            card.addEventListener('click', () => {
                const isSelected = card.classList.contains('selected');
                const volumeDiv = card.querySelector('.blend-tank-volume');
                const icon = card.querySelector('.blend-selected-icon');

                if (isSelected) {
                    // Deselect
                    card.classList.remove('selected');
                    card.style.borderColor = '';
                    card.style.borderWidth = '';
                    card.style.boxShadow = '';
                    volumeDiv.style.display = 'none';
                    icon.style.display = 'none';
                    // Clear volume input
                    const input = volumeDiv.querySelector('.blend-volume-input');
                    if (input) input.value = '';
                } else {
                    // Select
                    card.classList.add('selected');
                    card.style.borderColor = 'var(--primary)';
                    card.style.borderWidth = '2px';
                    card.style.boxShadow = '0 0.125rem 0.5rem rgba(0, 0, 0, 0.15)';
                    volumeDiv.style.display = 'block';
                    icon.style.display = 'block';
                }
            });
        });

        // Form submit
        document.getElementById('blendCalculatorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateBlend();
        });
    }

    calculateBlend() {
        const selectedTanks = [];
        let hasInvalidVolume = false;

        // Collect selected tanks and volumes
        document.querySelectorAll('.blend-tank-card.selected').forEach(card => {
            const tankId = card.dataset.id;
            const volumeInput = card.querySelector('.blend-volume-input');
            const volume = parseFloat(volumeInput.value);

            if (!volume || volume <= 0) {
                hasInvalidVolume = true;
            } else {
                const tank = this.tanks.find(t => t.id === tankId);
                selectedTanks.push({ ...tank, blendVolume: volume });
            }
        });

        if (hasInvalidVolume) {
            this.showToast(WineCalcI18n.t('blend.calculator.enterVolume') || 'Inserisci un volume valido per tutte le vasche selezionate', 'warning');
            return;
        }

        if (selectedTanks.length < 2) {
            this.showToast(WineCalcI18n.t('blend.calculator.selectAtLeast2') || 'Seleziona almeno 2 vasche', 'warning');
            return;
        }

        // Calculate blend
        const result = this.performBlendCalculation(selectedTanks);
        this.displayBlendResults(result, selectedTanks);
    }

    performBlendCalculation(tanks) {
        const totalVolume = tanks.reduce((sum, t) => sum + t.blendVolume, 0);

        // Weighted average for alcohol
        const avgAlcohol = tanks.reduce((sum, t) =>
            sum + (t.alcoholPercent * t.blendVolume), 0) / totalVolume;

        // Weighted average for acidity (if available)
        const tanksWithAcidity = tanks.filter(t => t.totalAcidity !== null);
        const avgAcidity = tanksWithAcidity.length > 0
            ? tanksWithAcidity.reduce((sum, t) =>
                sum + (t.totalAcidity * t.blendVolume), 0) / totalVolume
            : null;

        // pH calculation (logarithmic average - approximate)
        const tanksWithPH = tanks.filter(t => t.pH !== null);
        const avgPH = tanksWithPH.length > 0
            ? -Math.log10(tanksWithPH.reduce((sum, t) =>
                sum + (Math.pow(10, -t.pH) * t.blendVolume), 0) / totalVolume)
            : null;

        // Weighted average for sugars
        const tanksWithSugars = tanks.filter(t => t.residualSugars !== null);
        const avgSugars = tanksWithSugars.length > 0
            ? tanksWithSugars.reduce((sum, t) =>
                sum + (t.residualSugars * t.blendVolume), 0) / totalVolume
            : null;

        // Weighted average for SO2
        const tanksWithFreeSO2 = tanks.filter(t => t.freeSO2 !== null);
        const avgFreeSO2 = tanksWithFreeSO2.length > 0
            ? tanksWithFreeSO2.reduce((sum, t) =>
                sum + (t.freeSO2 * t.blendVolume), 0) / totalVolume
            : null;

        const tanksWithTotalSO2 = tanks.filter(t => t.totalSO2 !== null);
        const avgTotalSO2 = tanksWithTotalSO2.length > 0
            ? tanksWithTotalSO2.reduce((sum, t) =>
                sum + (t.totalSO2 * t.blendVolume), 0) / totalVolume
            : null;

        return {
            totalVolume,
            alcoholPercent: avgAlcohol,
            totalAcidity: avgAcidity,
            pH: avgPH,
            residualSugars: avgSugars,
            freeSO2: avgFreeSO2,
            totalSO2: avgTotalSO2
        };
    }

    displayBlendResults(result, tanks) {
        const container = document.getElementById('blendResults');

        let html = `
            <div class="alert alert-success">
                <h5 class="alert-heading">
                    <i class="bi bi-check-circle me-2"></i>
                    ${WineCalcI18n.t('blend.results.title') || 'Risultati Blend'}
                </h5>
                <hr>

                <!-- Proportions -->
                <h6 class="mt-3">${WineCalcI18n.t('blend.results.proportions') || 'Proporzioni'}</h6>
                <div class="row">
        `;

        tanks.forEach(tank => {
            const percentage = (tank.blendVolume / result.totalVolume * 100).toFixed(1);
            html += `
                <div class="col-md-6">
                    <strong>${this.escapeHtml(tank.name)}:</strong>
                    ${tank.blendVolume.toFixed(1)} L (${percentage}%)
                </div>
            `;
        });

        html += `
                </div>

                <!-- Results -->
                <h6 class="mt-4">${WineCalcI18n.t('blend.results.parameters') || 'Parametri del Blend'}</h6>
                <div class="row">
                    <div class="col-md-6">
                        <strong>${WineCalcI18n.t('blend.tankForm.currentVolume') || 'Volume Totale'}:</strong>
                        ${result.totalVolume.toFixed(1)} L
                    </div>
                    <div class="col-md-6">
                        <strong>${WineCalcI18n.t('blend.tankForm.alcohol') || 'Gradazione Alcolica'}:</strong>
                        ${result.alcoholPercent.toFixed(2)}% vol
                    </div>
                </div>
        `;

        if (result.totalAcidity !== null) {
            html += `
                <div class="row mt-2">
                    <div class="col-md-6">
                        <strong>${WineCalcI18n.t('blend.tankForm.acidity') || 'Acidità Totale'}:</strong>
                        ${result.totalAcidity.toFixed(2)} g/L
                    </div>
                </div>
            `;
        }

        if (result.pH !== null) {
            html += `
                <div class="row mt-2">
                    <div class="col-md-6">
                        <strong>${WineCalcI18n.t('blend.tankForm.ph') || 'pH'}:</strong>
                        ${result.pH.toFixed(2)}
                    </div>
                </div>
            `;
        }

        if (result.residualSugars !== null) {
            html += `
                <div class="row mt-2">
                    <div class="col-md-6">
                        <strong>${WineCalcI18n.t('blend.tankForm.sugars') || 'Zuccheri Residui'}:</strong>
                        ${result.residualSugars.toFixed(1)} g/L
                    </div>
                </div>
            `;
        }

        if (result.freeSO2 !== null || result.totalSO2 !== null) {
            html += `<div class="row mt-2">`;
            if (result.freeSO2 !== null) {
                html += `
                    <div class="col-md-6">
                        <strong>${WineCalcI18n.t('blend.tankForm.freeSO2') || 'SO2 Libera'}:</strong>
                        ${result.freeSO2.toFixed(0)} mg/L
                    </div>
                `;
            }
            if (result.totalSO2 !== null) {
                html += `
                    <div class="col-md-6">
                        <strong>${WineCalcI18n.t('blend.tankForm.totalSO2') || 'SO2 Totale'}:</strong>
                        ${result.totalSO2.toFixed(0)} mg/L
                    </div>
                `;
            }
            html += `</div>`;
        }

        html += `</div>`;
        container.innerHTML = html;
        container.style.display = 'block';

        // Scroll to results
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Utility Functions
    convertToLiters(value, unit) {
        return unit === 'hL' ? value * 100 : value;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'success') {
        // Toast notification with support for different types
        const iconMap = {
            success: 'bi-check-circle',
            warning: 'bi-exclamation-triangle',
            danger: 'bi-x-circle',
            info: 'bi-info-circle'
        };

        const colorMap = {
            success: 'bg-success',
            warning: 'bg-warning',
            danger: 'bg-danger',
            info: 'bg-info'
        };

        const icon = iconMap[type] || iconMap.success;
        const bgColor = colorMap[type] || colorMap.success;

        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '11';
        toast.innerHTML = `
            <div class="toast show" role="alert">
                <div class="toast-body ${bgColor} text-white rounded">
                    <i class="bi ${icon} me-2"></i>
                    ${this.escapeHtml(message)}
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.blendManager = new BlendManager();
});
