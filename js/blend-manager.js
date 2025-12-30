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
        this.updateBlendCalculator(); // Now safe to call since i18n is ready

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            console.log('[Blend] Language changed, re-rendering...');
            this.updateBlendCalculator();
        });
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

        // Export button
        document.getElementById('exportTanksBtn').addEventListener('click', () => {
            this.exportTanks();
        });

        // Import button
        document.getElementById('importTanksBtn').addEventListener('click', () => {
            document.getElementById('importFileInput').click();
        });

        // File input change
        document.getElementById('importFileInput').addEventListener('change', (e) => {
            this.importTanks(e);
        });

        // Clear errors on input for tank form fields
        ['tankName', 'tankCapacity', 'tankVolume', 'alcoholPercent'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.clearFieldError(fieldId);
                });
            }
        });
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.remove('is-invalid');
        const errorDiv = field.parentElement.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    showBlendError(message, containerId = 'blendErrorContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    showBlendInfo(message, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="alert alert-info alert-dismissible fade show mb-3" role="alert">
                <i class="bi bi-info-circle-fill me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    clearBlendErrors(containerId = 'blendErrorContainer') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
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

    // Import/Export
    exportTanks() {
        if (this.tanks.length === 0) {
            this.showToast(WineCalcI18n.t('blend.data.noTanks') || 'Nessuna vasca da esportare', 'warning');
            return;
        }

        try {
            const dataStr = JSON.stringify(this.tanks, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `winecalc-tanks-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.showToast(WineCalcI18n.t('blend.data.exported') || 'Vasche esportate con successo!', 'success');
        } catch (error) {
            console.error('[Blend] Export error:', error);
            this.showToast(WineCalcI18n.t('blend.data.exportError') || 'Errore durante l\'esportazione', 'danger');
        }
    }

    importTanks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);

                // Validate structure
                if (!Array.isArray(imported)) {
                    throw new Error('Invalid format: not an array');
                }

                // Validate each tank has required fields
                for (const tank of imported) {
                    if (!tank.name || tank.alcoholPercent === undefined || tank.volume === undefined) {
                        throw new Error('Invalid tank data: missing required fields');
                    }
                }

                // Ask for confirmation
                if (this.tanks.length > 0) {
                    if (!confirm(WineCalcI18n.t('blend.data.confirmImport') || 'Sostituire le vasche esistenti con quelle importate?')) {
                        event.target.value = ''; // Reset file input
                        return;
                    }
                }

                // Import tanks
                this.tanks = imported;
                this.saveTanksToStorage();
                this.renderTanksList();
                this.updateBlendCalculator();
                this.resetForm();

                this.showToast(
                    `${WineCalcI18n.t('blend.data.imported') || 'Importate'} ${imported.length} ${WineCalcI18n.t('blend.data.tanks') || 'vasche'}!`,
                    'success'
                );
            } catch (error) {
                console.error('[Blend] Import error:', error);
                this.showToast(WineCalcI18n.t('blend.data.importError') || 'Errore durante l\'importazione. Verifica il formato del file.', 'danger');
            }

            event.target.value = ''; // Reset file input
        };

        reader.onerror = () => {
            this.showToast(WineCalcI18n.t('blend.data.readError') || 'Errore nella lettura del file', 'danger');
            event.target.value = ''; // Reset file input
        };

        reader.readAsText(file);
    }

    // Tank CRUD Operations
    validateTankForm() {
        // Clear all previous errors
        this.clearFieldErrors();

        // Get form fields
        const tankName = document.getElementById('tankName').value.trim();
        const tankCapacity = document.getElementById('tankCapacity').value;
        const tankVolume = document.getElementById('tankVolume').value;
        const alcoholPercent = document.getElementById('alcoholPercent').value;

        let isValid = true;

        // Validate required fields
        if (!tankName) {
            this.showFieldError('tankName', WineCalcI18n.t('blend.validation.nameRequired') || 'Il nome della vasca è obbligatorio');
            isValid = false;
        }

        if (!tankCapacity || parseFloat(tankCapacity) <= 0) {
            this.showFieldError('tankCapacity', WineCalcI18n.t('blend.validation.capacityRequired') || 'La capienza deve essere maggiore di zero');
            isValid = false;
        }

        if (!tankVolume || parseFloat(tankVolume) <= 0) {
            this.showFieldError('tankVolume', WineCalcI18n.t('blend.validation.volumeRequired') || 'Il volume deve essere maggiore di zero');
            isValid = false;
        }

        if (!alcoholPercent || parseFloat(alcoholPercent) < 0 || parseFloat(alcoholPercent) > 20) {
            this.showFieldError('alcoholPercent', WineCalcI18n.t('blend.validation.alcoholRequired') || 'La gradazione alcolica deve essere tra 0 e 20%');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Add error class to field
        field.classList.add('is-invalid');

        // Create or update error message
        let errorDiv = field.parentElement.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    clearFieldErrors() {
        // Remove all error classes and messages
        document.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
        document.querySelectorAll('.invalid-feedback').forEach(error => {
            error.remove();
        });
    }

    saveTank() {
        // Clear field errors before saving
        this.clearFieldErrors();

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
            volatileAcidity: parseFloat(document.getElementById('volatileAcidity').value) || null,
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
        document.getElementById('volatileAcidity').value = tank.volatileAcidity || '';
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
        console.log('[Blend] updateBlendCalculator called, WineCalcI18n available:', !!window.WineCalcI18n);
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
            <!-- Nav Tabs -->
            <ul class="nav nav-tabs mb-4" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="from-tanks-tab" data-bs-toggle="tab"
                            data-bs-target="#from-tanks" type="button" role="tab">
                        <i class="bi bi-bucket me-2"></i>
                        ${WineCalcI18n.t('blend.calculator.fromTanks') || 'Da Vasche'}
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="from-target-tab" data-bs-toggle="tab"
                            data-bs-target="#from-target" type="button" role="tab">
                        <i class="bi bi-bullseye me-2"></i>
                        ${WineCalcI18n.t('blend.calculator.fromTarget') || 'Da Target'}
                    </button>
                </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content">
                <!-- From Tanks Tab -->
                <div class="tab-pane fade show active" id="from-tanks" role="tabpanel">
                    ${this.renderFromTanksCalculator()}
                </div>

                <!-- From Target Tab -->
                <div class="tab-pane fade" id="from-target" role="tabpanel">
                    ${this.renderFromTargetCalculator()}
                </div>
            </div>
        `;

        return html;
    }

    renderFromTanksCalculator() {
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
                        <div id="blendErrorContainer"></div>
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

    renderFromTargetCalculator() {
        let html = `
            <form id="targetBlendForm">
                <div class="row mb-4">
                    <div class="col-12">
                        <h6 class="mb-3">${WineCalcI18n.t('blend.calculator.targetTitle') || 'Imposta i parametri desiderati per il blend'}</h6>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-3">
                        <label class="form-label fw-bold">
                            ${WineCalcI18n.t('blend.tankForm.alcohol') || 'Gradazione Alcolica'} (%)
                            <span class="text-danger">*</span>
                        </label>
                        <input type="number" class="form-control" id="targetAlcohol"
                               step="0.1" min="0" max="20" placeholder="14.5">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">
                            ${WineCalcI18n.t('blend.tankForm.acidity') || 'Acidità Totale'} (g/L)
                            <small class="text-muted">(${WineCalcI18n.t('common.optional') || 'opzionale'})</small>
                        </label>
                        <input type="number" class="form-control" id="targetAcidity"
                               step="0.1" min="0" placeholder="5.5">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">
                            ${WineCalcI18n.t('blend.tankForm.volatileAcidity') || 'Acidità Volatile'} (g/L)
                            <small class="text-muted">(${WineCalcI18n.t('common.optional') || 'opzionale'})</small>
                        </label>
                        <input type="number" class="form-control" id="targetVolatileAcidity"
                               step="0.01" min="0" placeholder="0.5">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">
                            ${WineCalcI18n.t('blend.tankForm.ph') || 'pH'}
                            <small class="text-muted">(${WineCalcI18n.t('common.optional') || 'opzionale'})</small>
                        </label>
                        <input type="number" class="form-control" id="targetPH"
                               step="0.01" min="0" max="14" placeholder="3.5">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">
                            ${WineCalcI18n.t('blend.tankForm.sugars') || 'Zuccheri Residui'} (g/L)
                            <small class="text-muted">(${WineCalcI18n.t('common.optional') || 'opzionale'})</small>
                        </label>
                        <input type="number" class="form-control" id="targetSugars"
                               step="0.1" min="0" placeholder="2.0">
                    </div>
                </div>

                <div class="row mb-4">
                    <div class="col-12">
                        <label class="form-label">
                            ${WineCalcI18n.t('blend.calculator.emptyTank') || 'Vasca da svuotare completamente'}
                            <small class="text-muted">(${WineCalcI18n.t('common.optional') || 'opzionale'})</small>
                        </label>
                        <select class="form-select" id="emptyTankSelect">
                            <option value="">${WineCalcI18n.t('blend.calculator.noEmptyTank') || 'Nessuna - calcolo libero'}</option>
                            ${this.tanks.map(tank => `
                                <option value="${tank.id}">
                                    ${this.escapeHtml(tank.name)} (${tank.volume} ${tank.volumeUnit} - ${tank.alcoholPercent}% vol)
                                </option>
                            `).join('')}
                        </select>
                        <small class="form-text text-muted">
                            ${WineCalcI18n.t('blend.calculator.emptyTankHelp') || 'Se selezionata, il calcolo userà tutto il volume disponibile di questa vasca'}
                        </small>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <div id="targetBlendErrorContainer"></div>
                        <button type="submit" class="btn btn-primary-theme btn-lg w-100">
                            <i class="bi bi-lightbulb me-2"></i>
                            ${WineCalcI18n.t('blend.calculator.suggest') || 'Suggerisci Combinazioni'}
                        </button>
                    </div>
                </div>
            </form>
            <div id="targetBlendResults" class="mt-4" style="display: none;"></div>
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
        const blendForm = document.getElementById('blendCalculatorForm');
        if (blendForm) {
            blendForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateBlend();
            });
        }

        // Target blend form submit
        const targetForm = document.getElementById('targetBlendForm');
        if (targetForm) {
            targetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateTargetBlend();
            });
        }

        // Clear error on input for target alcohol field
        const targetAlcoholField = document.getElementById('targetAlcohol');
        if (targetAlcoholField) {
            targetAlcoholField.addEventListener('input', () => {
                this.clearFieldError('targetAlcohol');
            });
        }
    }

    calculateBlend() {
        // Clear previous errors
        this.clearBlendErrors('blendErrorContainer');

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
            this.showBlendError(
                WineCalcI18n.t('blend.calculator.enterVolume') || 'Inserisci un volume valido per tutte le vasche selezionate',
                'blendErrorContainer'
            );
            return;
        }

        if (selectedTanks.length < 2) {
            this.showBlendError(
                WineCalcI18n.t('blend.calculator.selectAtLeast2') || 'Seleziona almeno 2 vasche',
                'blendErrorContainer'
            );
            return;
        }

        // Calculate blend
        const result = this.performBlendCalculation(selectedTanks);
        this.displayBlendResults(result, selectedTanks);
    }

    calculateTargetBlend() {
        // Clear previous errors
        this.clearFieldErrors();
        this.clearBlendErrors('targetBlendErrorContainer');

        const targetAlcohol = parseFloat(document.getElementById('targetAlcohol').value);
        const targetAcidity = parseFloat(document.getElementById('targetAcidity').value) || null;
        const targetVolatileAcidity = parseFloat(document.getElementById('targetVolatileAcidity').value) || null;
        const targetPH = parseFloat(document.getElementById('targetPH').value) || null;
        const targetSugars = parseFloat(document.getElementById('targetSugars').value) || null;
        const emptyTankId = document.getElementById('emptyTankSelect').value;

        // Validation
        if (!targetAlcohol || targetAlcohol <= 0 || targetAlcohol > 20) {
            this.showFieldError('targetAlcohol', WineCalcI18n.t('blend.validation.alcoholRequired') || 'La gradazione alcolica deve essere tra 0 e 20%');
            return;
        }

        // Find all possible 2-tank combinations
        const combinations = [];

        if (emptyTankId) {
            // User wants to empty a specific tank
            const emptyTank = this.tanks.find(t => t.id === emptyTankId);

            // Try blending with all other tanks
            for (const otherTank of this.tanks) {
                if (otherTank.id === emptyTankId) continue;

                const combo = this.calculateTwoTankBlend(emptyTank, otherTank, targetAlcohol, targetAcidity, targetVolatileAcidity, targetPH, targetSugars, emptyTankId);
                if (combo) {
                    combinations.push(combo);
                }
            }
        } else {
            // Normal calculation - try all combinations
            for (let i = 0; i < this.tanks.length; i++) {
                for (let j = i + 1; j < this.tanks.length; j++) {
                    const tankA = this.tanks[i];
                    const tankB = this.tanks[j];

                    // Calculate combination
                    const combo = this.calculateTwoTankBlend(tankA, tankB, targetAlcohol, targetAcidity, targetVolatileAcidity, targetPH, targetSugars);
                    if (combo) {
                        combinations.push(combo);
                    }
                }
            }
        }

        if (combinations.length === 0) {
            this.showBlendInfo(
                WineCalcI18n.t('blend.calculator.noSolutions') || 'Nessuna combinazione trovata per raggiungere i parametri target',
                'targetBlendErrorContainer'
            );
            return;
        }

        // Sort by score (best first)
        combinations.sort((a, b) => b.score - a.score);

        // Display results
        this.displayTargetBlendResults(combinations, { alcohol: targetAlcohol, acidity: targetAcidity, volatileAcidity: targetVolatileAcidity, pH: targetPH, sugars: targetSugars }, emptyTankId);
    }

    calculateTwoTankBlend(tankA, tankB, targetAlcohol, targetAcidity, targetVolatileAcidity, targetPH, targetSugars, emptyTankId = null) {
        const alcoholA = tankA.alcoholPercent;
        const alcoholB = tankB.alcoholPercent;

        // Check if target is achievable
        if (targetAlcohol < Math.min(alcoholA, alcoholB) || targetAlcohol > Math.max(alcoholA, alcoholB)) {
            return null; // Target not in range
        }

        if (Math.abs(alcoholA - alcoholB) < 0.01) {
            return null; // Same alcohol, can't blend to different target
        }

        // Get max available volumes
        const maxVolumeA = this.convertToLiters(tankA.volume, tankA.volumeUnit);
        const maxVolumeB = this.convertToLiters(tankB.volume, tankB.volumeUnit);

        let volumeA, volumeB, totalVolume;

        if (emptyTankId) {
            // One tank must be emptied completely
            if (tankA.id === emptyTankId) {
                // Empty tank A completely
                volumeA = maxVolumeA;
                // Calculate how much B is needed: V_B = V_A * (A - target) / (target - B)
                volumeB = volumeA * (alcoholA - targetAlcohol) / (targetAlcohol - alcoholB);

                if (volumeB <= 0 || volumeB > maxVolumeB) {
                    return null; // Not feasible
                }
            } else if (tankB.id === emptyTankId) {
                // Empty tank B completely
                volumeB = maxVolumeB;
                // Calculate how much A is needed: V_A = V_B * (target - B) / (A - target)
                volumeA = volumeB * (targetAlcohol - alcoholB) / (alcoholA - targetAlcohol);

                if (volumeA <= 0 || volumeA > maxVolumeA) {
                    return null; // Not feasible
                }
            } else {
                // Normal calculation (no tank to empty in this combination)
                const ratio = (targetAlcohol - alcoholB) / (alcoholA - targetAlcohol);
                if (ratio <= 0) return null;

                totalVolume = 100;
                volumeA = (totalVolume * ratio) / (1 + ratio);
                volumeB = totalVolume - volumeA;
            }

            totalVolume = volumeA + volumeB;
        } else {
            // Normal calculation: normalize to 100L
            const ratio = (targetAlcohol - alcoholB) / (alcoholA - targetAlcohol);
            if (ratio <= 0) return null;

            totalVolume = 100;
            volumeA = (totalVolume * ratio) / (1 + ratio);
            volumeB = totalVolume - volumeA;
        }

        // Calculate percentages
        const percentA = (volumeA / totalVolume) * 100;
        const percentB = (volumeB / totalVolume) * 100;

        // Calculate resulting parameters
        const resultAcidity = tankA.totalAcidity && tankB.totalAcidity
            ? (tankA.totalAcidity * volumeA + tankB.totalAcidity * volumeB) / totalVolume
            : null;

        const resultVolatileAcidity = tankA.volatileAcidity !== null && tankB.volatileAcidity !== null
            ? (tankA.volatileAcidity * volumeA + tankB.volatileAcidity * volumeB) / totalVolume
            : null;

        const resultPH = tankA.pH && tankB.pH
            ? -Math.log10((Math.pow(10, -tankA.pH) * volumeA + Math.pow(10, -tankB.pH) * volumeB) / totalVolume)
            : null;

        const resultSugars = tankA.residualSugars !== null && tankB.residualSugars !== null
            ? (tankA.residualSugars * volumeA + tankB.residualSugars * volumeB) / totalVolume
            : null;

        // Calculate compatibility score (0-100)
        let score = 100;

        // Deduct if not enough volume available
        if (volumeA > maxVolumeA || volumeB > maxVolumeB) {
            score -= 30;
        }

        // Bonus if target acidity matches
        if (targetAcidity && resultAcidity) {
            const acidityDiff = Math.abs(resultAcidity - targetAcidity);
            score -= acidityDiff * 5; // Deduct 5 points per g/L difference
        }

        // Bonus if target volatile acidity matches
        if (targetVolatileAcidity && resultVolatileAcidity !== null) {
            const volatileAcidityDiff = Math.abs(resultVolatileAcidity - targetVolatileAcidity);
            score -= volatileAcidityDiff * 10; // Deduct 10 points per g/L difference
        }

        // Bonus if target pH matches
        if (targetPH && resultPH) {
            const phDiff = Math.abs(resultPH - targetPH);
            score -= phDiff * 20; // Deduct 20 points per pH unit difference
        }

        // Bonus if target sugars matches
        if (targetSugars && resultSugars !== null) {
            const sugarsDiff = Math.abs(resultSugars - targetSugars);
            score -= sugarsDiff * 3; // Deduct 3 points per g/L difference
        }

        score = Math.max(0, Math.min(100, score)); // Clamp between 0-100

        return {
            tankA,
            tankB,
            volumeA,
            volumeB,
            percentA,
            percentB,
            maxVolumeA,
            maxVolumeB,
            resultAlcohol: targetAlcohol,
            resultAcidity,
            resultVolatileAcidity,
            resultPH,
            resultSugars,
            score,
            feasible: volumeA <= maxVolumeA && volumeB <= maxVolumeB
        };
    }

    displayTargetBlendResults(combinations, targets, emptyTankId = null) {
        const container = document.getElementById('targetBlendResults');

        let html = `
            <div class="alert alert-success">
                <i class="bi bi-check-circle me-2"></i>
                ${WineCalcI18n.t('blend.calculator.foundSolutions') || 'Trovate'} <strong>${combinations.length}</strong>
                ${WineCalcI18n.t('blend.calculator.possibleCombinations') || 'combinazioni possibili'}
            </div>
        `;

        combinations.slice(0, 5).forEach((combo, index) => {
            const badgeClass = combo.feasible ? 'bg-success' : 'bg-warning';
            const badgeText = combo.feasible
                ? (WineCalcI18n.t('blend.calculator.feasible') || 'Fattibile')
                : (WineCalcI18n.t('blend.calculator.limitedVolume') || 'Volume Limitato');

            html += `
                <div class="card mb-3 ${!combo.feasible ? 'border-warning' : ''}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h6 class="mb-0">
                                ${WineCalcI18n.t('blend.calculator.combination') || 'Combinazione'} ${index + 1}
                            </h6>
                            <span class="badge ${badgeClass}">${badgeText}</span>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-2">
                                    <div class="me-3" style="width: 60px;">
                                        <strong>${Math.round(combo.percentA)}%</strong>
                                    </div>
                                    <div class="flex-grow-1">
                                        <strong>${this.escapeHtml(combo.tankA.name)}</strong>
                                        ${emptyTankId && combo.tankA.id === emptyTankId ?
                                            `<span class="badge bg-info ms-2">${WineCalcI18n.t('blend.calculator.emptied') || 'Svuotata'}</span>` : ''}
                                        <br>
                                        <small class="text-muted">
                                            ${combo.volumeA.toFixed(1)} L
                                            ${emptyTankId && combo.tankA.id === emptyTankId
                                                ? `<span class="text-info">(${WineCalcI18n.t('blend.calculator.totalVolume') || 'volume totale'})</span>`
                                                : !combo.feasible && combo.volumeA > combo.maxVolumeA
                                                ? `<span class="text-warning">(max: ${combo.maxVolumeA.toFixed(1)} L)</span>`
                                                : `(${WineCalcI18n.t('blend.calculator.available') || 'disponibili'}: ${combo.maxVolumeA.toFixed(1)} L)`}
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-2">
                                    <div class="me-3" style="width: 60px;">
                                        <strong>${Math.round(combo.percentB)}%</strong>
                                    </div>
                                    <div class="flex-grow-1">
                                        <strong>${this.escapeHtml(combo.tankB.name)}</strong>
                                        ${emptyTankId && combo.tankB.id === emptyTankId ?
                                            `<span class="badge bg-info ms-2">${WineCalcI18n.t('blend.calculator.emptied') || 'Svuotata'}</span>` : ''}
                                        <br>
                                        <small class="text-muted">
                                            ${combo.volumeB.toFixed(1)} L
                                            ${emptyTankId && combo.tankB.id === emptyTankId
                                                ? `<span class="text-info">(${WineCalcI18n.t('blend.calculator.totalVolume') || 'volume totale'})</span>`
                                                : !combo.feasible && combo.volumeB > combo.maxVolumeB
                                                ? `<span class="text-warning">(max: ${combo.maxVolumeB.toFixed(1)} L)</span>`
                                                : `(${WineCalcI18n.t('blend.calculator.available') || 'disponibili'}: ${combo.maxVolumeB.toFixed(1)} L)`}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr>

                        <div class="row">
                            <div class="col-md-3">
                                <small class="text-muted d-block">${WineCalcI18n.t('blend.tankForm.alcohol') || 'Gradazione'}</small>
                                <strong class="text-success">${combo.resultAlcohol.toFixed(2)}%</strong>
                            </div>
                            ${combo.resultAcidity ? `
                                <div class="col-md-3">
                                    <small class="text-muted d-block">${WineCalcI18n.t('blend.tankForm.acidity') || 'Acidità'}</small>
                                    <strong>${combo.resultAcidity.toFixed(2)} g/L</strong>
                                    ${targets.acidity ? `<br><small class="text-muted">(target: ${targets.acidity})</small>` : ''}
                                </div>
                            ` : ''}
                            ${combo.resultVolatileAcidity !== null ? `
                                <div class="col-md-3">
                                    <small class="text-muted d-block">${WineCalcI18n.t('blend.tankForm.volatileAcidity') || 'Acidità Volatile'}</small>
                                    <strong>${combo.resultVolatileAcidity.toFixed(2)} g/L</strong>
                                    ${targets.volatileAcidity ? `<br><small class="text-muted">(target: ${targets.volatileAcidity})</small>` : ''}
                                </div>
                            ` : ''}
                            ${combo.resultPH ? `
                                <div class="col-md-3">
                                    <small class="text-muted d-block">${WineCalcI18n.t('blend.tankForm.ph') || 'pH'}</small>
                                    <strong>${combo.resultPH.toFixed(2)}</strong>
                                    ${targets.pH ? `<br><small class="text-muted">(target: ${targets.pH})</small>` : ''}
                                </div>
                            ` : ''}
                            ${combo.resultSugars !== null ? `
                                <div class="col-md-3">
                                    <small class="text-muted d-block">${WineCalcI18n.t('blend.tankForm.sugars') || 'Zuccheri'}</small>
                                    <strong>${combo.resultSugars.toFixed(2)} g/L</strong>
                                    ${targets.sugars ? `<br><small class="text-muted">(target: ${targets.sugars})</small>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        if (combinations.length > 5) {
            html += `
                <p class="text-muted text-center">
                    ${WineCalcI18n.t('blend.calculator.showingTop5') || 'Mostrando le prime 5 combinazioni migliori'}
                </p>
            `;
        }

        container.innerHTML = html;
        container.style.display = 'block';
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

        // Weighted average for volatile acidity (if available)
        const tanksWithVolatileAcidity = tanks.filter(t => t.volatileAcidity !== null);
        const avgVolatileAcidity = tanksWithVolatileAcidity.length > 0
            ? tanksWithVolatileAcidity.reduce((sum, t) =>
                sum + (t.volatileAcidity * t.blendVolume), 0) / totalVolume
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
            volatileAcidity: avgVolatileAcidity,
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

        if (result.volatileAcidity !== null) {
            html += `
                <div class="row mt-2">
                    <div class="col-md-6">
                        <strong>${WineCalcI18n.t('blend.tankForm.volatileAcidity') || 'Acidità Volatile'}:</strong>
                        ${result.volatileAcidity.toFixed(2)} g/L
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
        toast.className = 'position-fixed top-0 end-0 p-3';
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

// Initialize when DOM is ready AND i18n is ready
function initBlendManager() {
    console.log('[Blend] Initializing BlendManager...');
    window.blendManager = new BlendManager();
}

// Wait for both DOM and i18n to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[Blend] DOM ready, checking i18n...');
        if (window.i18nReady) {
            console.log('[Blend] i18n already ready');
            initBlendManager();
        } else {
            console.log('[Blend] Waiting for i18n...');
            window.addEventListener('i18nReady', initBlendManager, { once: true });
        }
    });
} else {
    // DOM already loaded
    if (window.i18nReady) {
        initBlendManager();
    } else {
        window.addEventListener('i18nReady', initBlendManager, { once: true });
    }
}
