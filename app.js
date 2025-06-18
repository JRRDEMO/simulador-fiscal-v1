// Nexus Fiscal Canarias - Main Application
class StateManager {
    constructor() {
        this.currentProject = {
            beneficio: 0,
            inversion: 0,
            gastosIDI: 0,
            incentivos: {
                ric: true,
                dic: true,
                idi: false
            },
            resultados: {}
        };
    }

    updateProject(data) {
        this.currentProject = { ...this.currentProject, ...data };
    }

    getProject() {
        return this.currentProject;
    }

    resetProject() {
        this.currentProject = {
            beneficio: 0,
            inversion: 0,
            gastosIDI: 0,
            incentivos: {
                ric: true,
                dic: true,
                idi: false
            },
            resultados: {}
        };
    }
}

class FiscalEngine {
    constructor() {
        this.tipoIS = 25; // Tipo general del Impuesto sobre Sociedades
        this.limiteConjunto = 50; // Límite conjunto general
        this.limiteMejorado = 90; // Límite mejorado para islas menores
    }

    calculateRIC(beneficio, porcentaje = 90, tipo = 25) {
        const reserva = beneficio * (porcentaje / 100);
        const ahorroFiscal = reserva * (tipo / 100);
        const beneficioTributable = beneficio - reserva;
        const cuotaFinal = beneficioTributable * (tipo / 100);
        const cuotaOriginal = beneficio * (tipo / 100);
        const reduccionCuota = cuotaOriginal - cuotaFinal;

        return {
            beneficioOriginal: beneficio,
            reservaConstituida: reserva,
            beneficioTributable: beneficioTributable,
            ahorroFiscal: ahorroFiscal,
            cuotaOriginal: cuotaOriginal,
            cuotaFinal: cuotaFinal,
            reduccionCuota: reduccionCuota,
            porcentajeAhorro: (ahorroFiscal / cuotaOriginal) * 100,
            tipoEfectivo: (cuotaFinal / beneficio) * 100
        };
    }

    calculateDIC(inversion, cuotaIntegra, otrasDeduccionesCuota = 0) {
        const deduccionDIC = inversion * 0.25; // 25% de la inversión
        const limiteAplicacion = cuotaIntegra * 0.5; // Límite del 50%
        const espacioDisponible = Math.max(0, limiteAplicacion - otrasDeduccionesCuota);
        const deduccionAplicable = Math.min(deduccionDIC, espacioDisponible);
        const deduccionPendiente = deduccionDIC - deduccionAplicable;
        const creditoFiscal = deduccionPendiente * 0.8; // Monetización al 80%

        return {
            inversion: inversion,
            deduccionCalculada: deduccionDIC,
            limiteAplicacion: limiteAplicacion,
            espacioDisponible: espacioDisponible,
            deduccionAplicable: deduccionAplicable,
            deduccionPendiente: deduccionPendiente,
            creditoFiscal: creditoFiscal,
            ahorroTotal: deduccionAplicable + creditoFiscal,
            cuotaOriginal: cuotaIntegra,
            cuotaFinal: cuotaIntegra - deduccionAplicable
        };
    }

    calculateIDI(gastosGenerales, gastosIncrementales, gastosInnovacion, cuotaIntegra, ubicacion = 'general') {
        // Porcentajes mejorados para Canarias
        const porcentajeGeneral = 45;
        const porcentajeIncremental = 75.6;
        const porcentajeInnovacion = 45;

        const deduccionGeneral = gastosGenerales * (porcentajeGeneral / 100);
        const deduccionIncremental = gastosIncrementales * (porcentajeIncremental / 100);
        const deduccionInnovacion = gastosInnovacion * (porcentajeInnovacion / 100);
        const deduccionTotal = deduccionGeneral + deduccionIncremental + deduccionInnovacion;

        // Límites según ubicación
        const limitePorcentaje = ubicacion === 'menores' ? 90 : 60;
        const limiteAplicacion = cuotaIntegra * (limitePorcentaje / 100);
        const deduccionAplicable = Math.min(deduccionTotal, limiteAplicacion);
        const deduccionPendiente = deduccionTotal - deduccionAplicable;
        const creditoFiscal = deduccionPendiente * 0.8;

        return {
            gastosGenerales: gastosGenerales,
            gastosIncrementales: gastosIncrementales,
            gastosInnovacion: gastosInnovacion,
            deduccionGeneral: deduccionGeneral,
            deduccionIncremental: deduccionIncremental,
            deduccionInnovacion: deduccionInnovacion,
            deduccionTotal: deduccionTotal,
            limiteAplicacion: limiteAplicacion,
            deduccionAplicable: deduccionAplicable,
            deduccionPendiente: deduccionPendiente,
            creditoFiscal: creditoFiscal,
            ahorroTotal: deduccionAplicable + creditoFiscal,
            cuotaOriginal: cuotaIntegra,
            cuotaFinal: cuotaIntegra - deduccionAplicable
        };
    }

    calculateAudiovisual(coste, tipo, cuotaIntegra) {
        let porcentaje;
        if (tipo === 'española') {
            porcentaje = coste <= 1000000 ? 54 : 45; // 54% primer millón, 45% resto
        } else {
            porcentaje = 40; // 40% producciones extranjeras
        }

        const deduccionCalculada = coste * (porcentaje / 100);
        const deduccionAplicable = Math.min(deduccionCalculada, cuotaIntegra);
        const deduccionPendiente = deduccionCalculada - deduccionAplicable;
        const creditoFiscal = deduccionPendiente * 0.8;

        return {
            costeProduccion: coste,
            tipoProduccion: tipo,
            porcentajeAplicable: porcentaje,
            deduccionCalculada: deduccionCalculada,
            deduccionAplicable: deduccionAplicable,
            deduccionPendiente: deduccionPendiente,
            creditoFiscal: creditoFiscal,
            ahorroTotal: deduccionAplicable + creditoFiscal,
            cuotaOriginal: cuotaIntegra,
            cuotaFinal: cuotaIntegra - deduccionAplicable
        };
    }

    runIntegratedSimulation(beneficio, inversion, gastosIDI, incentivos) {
        // Paso 1: Aplicar RIC primero (reduce la base imponible)
        let beneficioTributable = beneficio;
        let ahorroRIC = 0;
        
        if (incentivos.ric) {
            const resultadoRIC = this.calculateRIC(beneficio, 90, this.tipoIS);
            beneficioTributable = resultadoRIC.beneficioTributable;
            ahorroRIC = resultadoRIC.ahorroFiscal;
        }

        // Paso 2: Calcular cuota íntegra sobre beneficio tributable
        const cuotaIntegra = beneficioTributable * (this.tipoIS / 100);

        // Paso 3: Aplicar deducciones DIC e I+D+i con límites conjuntos
        let deduccionDIC = 0;
        let deduccionIDI = 0;
        let creditoFiscalDIC = 0;
        let creditoFiscalIDI = 0;

        if (incentivos.dic) {
            const resultadoDIC = this.calculateDIC(inversion, cuotaIntegra, 0);
            deduccionDIC = resultadoDIC.deduccionAplicable;
            creditoFiscalDIC = resultadoDIC.creditoFiscal;
        }

        if (incentivos.idi) {
            const otrasDeduccionesCuota = deduccionDIC;
            const resultadoIDI = this.calculateIDI(gastosIDI, 0, 0, cuotaIntegra);
            const espacioDisponible = Math.max(0, resultadoIDI.limiteAplicacion - otrasDeduccionesCuota);
            deduccionIDI = Math.min(resultadoIDI.deduccionTotal, espacioDisponible);
            const pendienteIDI = resultadoIDI.deduccionTotal - deduccionIDI;
            creditoFiscalIDI = pendienteIDI * 0.8;
        }

        // Paso 4: Calcular resultados finales
        const totalDeducciones = deduccionDIC + deduccionIDI;
        const totalCreditos = creditoFiscalDIC + creditoFiscalIDI;
        const cuotaFinal = Math.max(0, cuotaIntegra - totalDeducciones);
        const cuotaOriginalSinRIC = beneficio * (this.tipoIS / 100);
        const ahorroTotal = ahorroRIC + totalDeducciones + totalCreditos;
        const tipoEfectivo = ((cuotaOriginalSinRIC - ahorroTotal) / beneficio) * 100;

        return {
            beneficioOriginal: beneficio,
            beneficioTributable: beneficioTributable,
            cuotaOriginalSinRIC: cuotaOriginalSinRIC,
            cuotaIntegra: cuotaIntegra,
            cuotaFinal: cuotaFinal,
            ahorroRIC: ahorroRIC,
            deduccionDIC: deduccionDIC,
            deduccionIDI: deduccionIDI,
            totalDeducciones: totalDeducciones,
            creditoFiscalDIC: creditoFiscalDIC,
            creditoFiscalIDI: creditoFiscalIDI,
            totalCreditos: totalCreditos,
            ahorroTotal: ahorroTotal,
            tipoEfectivo: tipoEfectivo,
            efectividadFiscal: (ahorroTotal / cuotaOriginalSinRIC) * 100
        };
    }
}

class UIManager {
    constructor() {
        this.currentView = 'inicio';
        this.currentCalculator = 'ric';
        this.dashboardChart = null;
    }

    showView(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.remove('active');
        });
        const navLink = document.querySelector(`[href="#${viewId}"]`);
        if (navLink) {
            navLink.classList.add('active');
        }

        this.currentView = viewId;

        // Close mobile menu if open
        const navList = document.querySelector('.nav__list');
        if (navList) {
            navList.classList.remove('active');
        }
    }

    showCalculator(calculatorId) {
        // First show simulators view
        this.showView('simuladores');
        
        // Hide all calculators
        document.querySelectorAll('.calculator').forEach(calc => {
            calc.classList.remove('active');
        });

        // Show selected calculator
        const targetCalculator = document.getElementById(`calc-${calculatorId}`);
        if (targetCalculator) {
            targetCalculator.classList.add('active');
        }

        // Update calculator navigation
        document.querySelectorAll('.calculator-nav__item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-calculator="${calculatorId}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        this.currentCalculator = calculatorId;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatPercentage(percentage) {
        return new Intl.NumberFormat('es-ES', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(percentage / 100);
    }

    renderResults(containerId, results, type) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<h3>Resultados del Cálculo</h3>';
        
        switch (type) {
            case 'ric':
                html += this.renderRICResults(results);
                break;
            case 'dic':
                html += this.renderDICResults(results);
                break;
            case 'idi':
                html += this.renderIDIResults(results);
                break;
            case 'audiovisual':
                html += this.renderAudiovisualResults(results);
                break;
        }

        container.innerHTML = html;
        container.classList.remove('hidden');
    }

    renderRICResults(results) {
        return `
            <div class="result-highlight">
                <h4>Ahorro Fiscal Total: ${this.formatCurrency(results.ahorroFiscal)}</h4>
                <p>Tipo impositivo efectivo: ${this.formatPercentage(results.tipoEfectivo)}</p>
            </div>
            <div class="result-item">
                <span class="result-label">Beneficio original:</span>
                <span class="result-value">${this.formatCurrency(results.beneficioOriginal)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Reserva constituida (RIC):</span>
                <span class="result-value">${this.formatCurrency(results.reservaConstituida)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Beneficio tributable:</span>
                <span class="result-value">${this.formatCurrency(results.beneficioTributable)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Cuota original:</span>
                <span class="result-value">${this.formatCurrency(results.cuotaOriginal)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Cuota final:</span>
                <span class="result-value">${this.formatCurrency(results.cuotaFinal)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Reducción de cuota:</span>
                <span class="result-value">${this.formatCurrency(results.reduccionCuota)}</span>
            </div>
        `;
    }

    renderDICResults(results) {
        return `
            <div class="result-highlight">
                <h4>Ahorro Total: ${this.formatCurrency(results.ahorroTotal)}</h4>
                <p>Deducción aplicable: ${this.formatCurrency(results.deduccionAplicable)}</p>
            </div>
            <div class="result-item">
                <span class="result-label">Inversión:</span>
                <span class="result-value">${this.formatCurrency(results.inversion)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Deducción calculada (25%):</span>
                <span class="result-value">${this.formatCurrency(results.deduccionCalculada)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Límite aplicación (50%):</span>
                <span class="result-value">${this.formatCurrency(results.limiteAplicacion)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Deducción aplicable:</span>
                <span class="result-value">${this.formatCurrency(results.deduccionAplicable)}</span>
            </div>
            ${results.deduccionPendiente > 0 ? `
            <div class="result-item">
                <span class="result-label">Deducción pendiente:</span>
                <span class="result-value">${this.formatCurrency(results.deduccionPendiente)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Crédito fiscal (80%):</span>
                <span class="result-value">${this.formatCurrency(results.creditoFiscal)}</span>
            </div>
            ` : ''}
        `;
    }

    renderIDIResults(results) {
        return `
            <div class="result-highlight">
                <h4>Ahorro Total: ${this.formatCurrency(results.ahorroTotal)}</h4>
                <p>Deducción aplicable: ${this.formatCurrency(results.deduccionAplicable)}</p>
            </div>
            <div class="result-item">
                <span class="result-label">Gastos I+D generales:</span>
                <span class="result-value">${this.formatCurrency(results.gastosGenerales)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Deducción general (45%):</span>
                <span class="result-value">${this.formatCurrency(results.deduccionGeneral)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Deducción incremental (75.6%):</span>
                <span class="result-value">${this.formatCurrency(results.deduccionIncremental)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Deducción innovación (45%):</span>
                <span class="result-value">${this.formatCurrency(results.deduccionInnovacion)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Deducción total:</span>
                <span class="result-value">${this.formatCurrency(results.deduccionTotal)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Límite aplicación:</span>
                <span class="result-value">${this.formatCurrency(results.limiteAplicacion)}</span>
            </div>
            ${results.deduccionPendiente > 0 ? `
            <div class="result-item">
                <span class="result-label">Crédito fiscal (80%):</span>
                <span class="result-value">${this.formatCurrency(results.creditoFiscal)}</span>
            </div>
            ` : ''}
        `;
    }

    renderAudiovisualResults(results) {
        return `
            <div class="result-highlight">
                <h4>Ahorro Total: ${this.formatCurrency(results.ahorroTotal)}</h4>
                <p>Deducción aplicable: ${this.formatCurrency(results.deduccionAplicable)}</p>
            </div>
            <div class="result-item">
                <span class="result-label">Coste de producción:</span>
                <span class="result-value">${this.formatCurrency(results.costeProduccion)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Tipo de producción:</span>
                <span class="result-value">${results.tipoProduccion === 'española' ? 'Española' : 'Extranjera'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Porcentaje aplicable:</span>
                <span class="result-value">${results.porcentajeAplicable}%</span>
            </div>
            <div class="result-item">
                <span class="result-label">Deducción calculada:</span>
                <span class="result-value">${this.formatCurrency(results.deduccionCalculada)}</span>
            </div>
            ${results.deduccionPendiente > 0 ? `
            <div class="result-item">
                <span class="result-label">Crédito fiscal (80%):</span>
                <span class="result-value">${this.formatCurrency(results.creditoFiscal)}</span>
            </div>
            ` : ''}
        `;
    }

    renderDashboardResults(results) {
        // Update summary cards
        const totalAhorro = document.getElementById('total-ahorro');
        const efectividad = document.getElementById('efectividad');
        const tipoEfectivo = document.getElementById('tipo-efectivo');
        
        if (totalAhorro) totalAhorro.textContent = this.formatCurrency(results.ahorroTotal);
        if (efectividad) efectividad.textContent = this.formatPercentage(results.efectividadFiscal);
        if (tipoEfectivo) tipoEfectivo.textContent = this.formatPercentage(results.tipoEfectivo);

        // Show results container
        const resultsContainer = document.getElementById('dashboard-results-content');
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
        }

        // Create chart
        this.createDashboardChart(results);
    }

    createDashboardChart(results) {
        const canvas = document.getElementById('dashboard-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.dashboardChart) {
            this.dashboardChart.destroy();
        }

        const data = {
            labels: ['Impuesto Original', 'Ahorro RIC', 'Ahorro DIC', 'Ahorro I+D+i', 'Créditos Fiscales', 'Impuesto Final'],
            datasets: [{
                label: 'Análisis Fiscal (€)',
                data: [
                    results.cuotaOriginalSinRIC,
                    -results.ahorroRIC,
                    -results.deduccionDIC,
                    -results.deduccionIDI,
                    -(results.creditoFiscalDIC + results.creditoFiscalIDI),
                    results.cuotaFinal
                ],
                backgroundColor: [
                    '#D93025',
                    '#1FB8CD',
                    '#FFC185',
                    '#B4413C',
                    '#5D878F',
                    '#008060'
                ],
                borderColor: [
                    '#D93025',
                    '#1FB8CD',
                    '#FFC185',
                    '#B4413C',
                    '#5D878F',
                    '#008060'
                ],
                borderWidth: 1
            }]
        };

        this.dashboardChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Análisis de Ahorro Fiscal Integrado'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(Math.abs(value));
                            }
                        }
                    }
                }
            }
        });
    }
}

class EconomicAnalysisEngine {
    calculateRatios(beneficio, ahorroFiscal, inversion) {
        const roi = ((beneficio + ahorroFiscal - inversion) / inversion) * 100;
        const payback = inversion / (beneficio + ahorroFiscal);
        
        return {
            roi: roi,
            paybackPeriod: payback,
            efectividadFiscal: (ahorroFiscal / (beneficio * 0.25)) * 100
        };
    }

    generateScenarios(baseData) {
        const scenarios = [];
        const variations = [0.8, 0.9, 1.0, 1.1, 1.2];
        
        variations.forEach(multiplier => {
            const scenario = {
                name: `Escenario ${multiplier > 1 ? 'Optimista' : multiplier < 1 ? 'Conservador' : 'Base'} (${(multiplier * 100).toFixed(0)}%)`,
                beneficio: baseData.beneficio * multiplier,
                inversion: baseData.inversion * multiplier,
                gastosIDI: baseData.gastosIDI * multiplier,
                multiplier: multiplier
            };
            scenarios.push(scenario);
        });
        
        return scenarios;
    }
}

// Main Application Class
class NexusFiscalApp {
    constructor() {
        this.stateManager = new StateManager();
        this.fiscalEngine = new FiscalEngine();
        this.uiManager = new UIManager();
        this.analysisEngine = new EconomicAnalysisEngine();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRangeSliders();
        this.setupNavigation();
        this.setupCalculatorNavigation();
        this.setupGuideButtons();
    }

    setupEventListeners() {
        // Navigation toggle for mobile
        const navToggle = document.querySelector('.nav__toggle');
        const navList = document.querySelector('.nav__list');
        
        if (navToggle && navList) {
            navToggle.addEventListener('click', () => {
                navList.classList.toggle('active');
            });
        }

        // Form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Clear form placeholders on focus
        document.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.type === 'number' && e.target.placeholder) {
                e.target.dataset.placeholder = e.target.placeholder;
                e.target.placeholder = '';
            }
        }, true);

        document.addEventListener('blur', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.type === 'number' && e.target.dataset.placeholder) {
                if (!e.target.value) {
                    e.target.placeholder = e.target.dataset.placeholder;
                }
            }
        }, true);
    }

    setupRangeSliders() {
        const rangeSliders = document.querySelectorAll('.range-slider');
        rangeSliders.forEach(slider => {
            const valueDisplay = slider.parentNode.querySelector('.range-value');
            if (valueDisplay) {
                slider.addEventListener('input', (e) => {
                    valueDisplay.textContent = e.target.value + '%';
                });
            }
        });
    }

    setupNavigation() {
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const viewId = link.getAttribute('href').substring(1);
                this.showView(viewId);
            });
        });
    }

    setupCalculatorNavigation() {
        document.querySelectorAll('.calculator-nav__item').forEach(item => {
            item.addEventListener('click', (e) => {
                const calculatorId = item.getAttribute('data-calculator');
                this.showCalculator(calculatorId);
            });
        });
    }

    setupGuideButtons() {
        // Setup guide card buttons to show calculators
        document.addEventListener('click', (e) => {
            if (e.target.matches('.guide-card .btn')) {
                const button = e.target;
                const onclick = button.getAttribute('onclick');
                if (onclick && onclick.includes('showCalculator')) {
                    e.preventDefault();
                    const match = onclick.match(/showCalculator\('(\w+)'\)/);
                    if (match) {
                        this.showCalculator(match[1]);
                    }
                }
            }
        });
    }

    showView(viewId) {
        this.uiManager.showView(viewId);
    }

    showCalculator(calculatorId) {
        this.uiManager.showCalculator(calculatorId);
    }

    calculateRIC() {
        const beneficio = parseFloat(document.getElementById('ric-beneficio').value) || 0;
        const porcentaje = parseFloat(document.getElementById('ric-porcentaje').value) || 90;
        const tipo = parseFloat(document.getElementById('ric-tipo').value) || 25;

        if (beneficio <= 0) {
            alert('Por favor, introduce un beneficio válido mayor que 0');
            return;
        }

        const results = this.fiscalEngine.calculateRIC(beneficio, porcentaje, tipo);
        this.uiManager.renderResults('ric-results', results, 'ric');
    }

    calculateDIC() {
        const inversion = parseFloat(document.getElementById('dic-inversion').value) || 0;
        const cuota = parseFloat(document.getElementById('dic-cuota').value) || 0;
        const otras = parseFloat(document.getElementById('dic-otras').value) || 0;

        if (inversion <= 0 || cuota <= 0) {
            alert('Por favor, introduce valores válidos para inversión y cuota íntegra (ambos deben ser mayores que 0)');
            return;
        }

        const results = this.fiscalEngine.calculateDIC(inversion, cuota, otras);
        this.uiManager.renderResults('dic-results', results, 'dic');
    }

    calculateIDI() {
        const gastosGenerales = parseFloat(document.getElementById('idi-gastos-generales').value) || 0;
        const gastosIncrementales = parseFloat(document.getElementById('idi-gastos-incrementales').value) || 0;
        const gastosInnovacion = parseFloat(document.getElementById('idi-innovacion').value) || 0;
        const cuota = parseFloat(document.getElementById('idi-cuota').value) || 0;
        const ubicacion = document.getElementById('idi-ubicacion').value;

        if (gastosGenerales <= 0 || cuota <= 0) {
            alert('Por favor, introduce valores válidos para gastos I+D generales y cuota íntegra (ambos deben ser mayores que 0)');
            return;
        }

        const results = this.fiscalEngine.calculateIDI(gastosGenerales, gastosIncrementales, gastosInnovacion, cuota, ubicacion);
        this.uiManager.renderResults('idi-results', results, 'idi');
    }

    calculateAudiovisual() {
        const coste = parseFloat(document.getElementById('audiovisual-coste').value) || 0;
        const tipo = document.getElementById('audiovisual-tipo').value;
        const cuota = parseFloat(document.getElementById('audiovisual-cuota').value) || 0;

        if (coste <= 0 || cuota <= 0) {
            alert('Por favor, introduce valores válidos para coste de producción y cuota íntegra (ambos deben ser mayores que 0)');
            return;
        }

        const results = this.fiscalEngine.calculateAudiovisual(coste, tipo, cuota);
        this.uiManager.renderResults('audiovisual-results', results, 'audiovisual');
    }

    runIntegratedSimulation() {
        const beneficio = parseFloat(document.getElementById('dashboard-beneficio').value) || 0;
        const inversion = parseFloat(document.getElementById('dashboard-inversion').value) || 0;
        const gastosIDI = parseFloat(document.getElementById('dashboard-idi').value) || 0;

        const incentivos = {
            ric: document.getElementById('dashboard-ric').checked,
            dic: document.getElementById('dashboard-dic').checked,
            idi: document.getElementById('dashboard-idi-check').checked
        };

        if (beneficio <= 0) {
            alert('Por favor, introduce un beneficio anual válido mayor que 0');
            return;
        }

        if (incentivos.dic && inversion <= 0) {
            alert('Para aplicar DIC, introduce una inversión planificada válida mayor que 0');
            return;
        }

        if (incentivos.idi && gastosIDI <= 0) {
            alert('Para aplicar incentivos I+D+i, introduce gastos I+D+i válidos mayores que 0');
            return;
        }

        const results = this.fiscalEngine.runIntegratedSimulation(beneficio, inversion, gastosIDI, incentivos);
        this.uiManager.renderDashboardResults(results);
        
        // Update state
        this.stateManager.updateProject({
            beneficio: beneficio,
            inversion: inversion,
            gastosIDI: gastosIDI,
            incentivos: incentivos,
            resultados: results
        });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NexusFiscalApp();
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}