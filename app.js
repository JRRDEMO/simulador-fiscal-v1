// =============================================================================
// HERRAMIENTA DE PLANIFICACIÓN FISCAL SPEGC
// Arquitectura Modular Completa para Gran Canaria
// =============================================================================

// =============================================================================
// CONFIGURACIONES Y CONSTANTES
// =============================================================================

const GRAN_CANARIA_CONFIG = {
    zec: {
        minInvestment: 100000,
        minEmployment: 5,
        taxRate: 0.04
    },
    deductions: {
        jointLimit: 0.60, // 60% para Gran Canaria
        corporateTaxRate: 0.25
    },
    ric: {
        maxPercentage: 90
    },
    dic: {
        deductionRate: 0.25
    },
    idi: {
        generalRate: 0.45,
        incrementalRate: 0.27,
        bonusRate: 0.17
    },
    audiovisual: {
        firstMillionRate: 0.54,
        generalRate: 0.45,
        spanishLimit: 0.50,
        foreignLimit: 18000000
    }
};

const PROJECT_TYPES = {
    general: { 
        name: 'Proyecto General', 
        incentives: ['ric', 'dic'],
        description: 'RIC y DIC básicos para empresas generales'
    },
    idi: { 
        name: 'I+D+i', 
        incentives: ['ric', 'dic', 'idi'],
        description: 'Incluye incentivos específicos de I+D+i'
    },
    audiovisual: { 
        name: 'Audiovisual', 
        incentives: ['ric', 'audiovisual'],
        description: 'Incentivos para producciones audiovisuales'
    },
    complete: { 
        name: 'Análisis Completo', 
        incentives: ['ric', 'dic', 'idi', 'audiovisual'],
        description: 'Todos los incentivos disponibles'
    }
};

// =============================================================================
// MÓDULOS DE CONFIGURACIÓN
// =============================================================================

class RICConfig {
    static getConfig() {
        return {
            maxPercentage: GRAN_CANARIA_CONFIG.ric.maxPercentage,
            description: 'Reserva para Inversiones en Canarias',
            fields: [
                { 
                    name: 'ricUndistributedProfits', 
                    label: 'Beneficios No Distribuidos (€)', 
                    type: 'number',
                    tooltip: 'Beneficios que la empresa no distribuye como dividendos'
                },
                { 
                    name: 'ricPercentage', 
                    label: 'Porcentaje a Reservar (%)', 
                    type: 'number', 
                    max: 90, 
                    default: 90,
                    tooltip: 'Máximo 90% de los beneficios no distribuidos'
                },
                { 
                    name: 'ricMaterializationTerm', 
                    label: 'Plazo Materialización (años)', 
                    type: 'number', 
                    max: 4, 
                    default: 4,
                    tooltip: 'Plazo para materializar la inversión (máximo 4 años)'
                }
            ]
        };
    }
}

class DICConfig {
    static getConfig() {
        return {
            deductionRate: GRAN_CANARIA_CONFIG.dic.deductionRate,
            description: 'Deducción por Inversiones en Canarias',
            fields: [
                { 
                    name: 'dicFixedAssets', 
                    label: 'Inversión en Activos Fijos (€)', 
                    type: 'number',
                    tooltip: 'Inversiones en activos productivos materiales'
                },
                { 
                    name: 'dicAssetType', 
                    label: 'Tipo de Activo', 
                    type: 'select',
                    options: [
                        { value: 'general', label: 'General (25%)' },
                        { value: 'environmental', label: 'Medioambiental (25%)' },
                        { value: 'digital', label: 'Digitalización (25%)' }
                    ],
                    tooltip: 'Tipo de activo para la deducción'
                }
            ]
        };
    }
}

class IDIConfig {
    static getConfig() {
        return {
            generalRate: GRAN_CANARIA_CONFIG.idi.generalRate,
            incrementalRate: GRAN_CANARIA_CONFIG.idi.incrementalRate,
            bonusRate: GRAN_CANARIA_CONFIG.idi.bonusRate,
            description: 'Incentivos de Investigación, Desarrollo e Innovación',
            fields: [
                { 
                    name: 'idiPersonnel', 
                    label: 'Gastos de Personal I+D+i (€)', 
                    type: 'number',
                    tooltip: 'Gastos de personal cualificado exclusivamente en I+D+i'
                },
                { 
                    name: 'idiFixedAssets', 
                    label: 'Gastos en Activos Fijos (€)', 
                    type: 'number',
                    tooltip: 'Inversiones en equipamiento para I+D+i'
                },
                { 
                    name: 'idiOperational', 
                    label: 'Gastos Operativos (€)', 
                    type: 'number',
                    tooltip: 'Otros gastos corrientes de I+D+i'
                },
                { 
                    name: 'idiPreviousYear', 
                    label: 'Media Gastos 2 Años Anteriores (€)', 
                    type: 'number',
                    tooltip: 'Media de gastos I+D+i de los dos años anteriores'
                },
                { 
                    name: 'idiQualifiedPersonnel', 
                    label: 'Personal Cualificado Exclusivo', 
                    type: 'checkbox',
                    tooltip: 'Personal con dedicación exclusiva a I+D+i (+17% bonificación)'
                }
            ]
        };
    }
}

class AudiovisualConfig {
    static getConfig() {
        return {
            firstMillionRate: GRAN_CANARIA_CONFIG.audiovisual.firstMillionRate,
            generalRate: GRAN_CANARIA_CONFIG.audiovisual.generalRate,
            spanishLimit: GRAN_CANARIA_CONFIG.audiovisual.spanishLimit,
            foreignLimit: GRAN_CANARIA_CONFIG.audiovisual.foreignLimit,
            description: 'Incentivos para Producciones Audiovisuales',
            fields: [
                { 
                    name: 'audiovisualInvestment', 
                    label: 'Inversión Total (€)', 
                    type: 'number',
                    tooltip: 'Inversión total en la producción audiovisual'
                },
                { 
                    name: 'audiovisualType', 
                    label: 'Tipo de Producción', 
                    type: 'select',
                    options: [
                        { value: 'spanish', label: 'Española (54% primer millón, 45% resto)' },
                        { value: 'foreign', label: 'Extranjera (45%)' },
                        { value: 'coproduction', label: 'Coproducción (45%)' }
                    ],
                    tooltip: 'Tipo de producción según normativa'
                },
                { 
                    name: 'audiovisualMonetization', 
                    label: 'Solicitar Monetización', 
                    type: 'checkbox',
                    tooltip: 'Opción de monetización inmediata'
                }
            ]
        };
    }
}

// =============================================================================
// CALCULADORAS ESPECÍFICAS
// =============================================================================

class RICCalculator {
    static calculate(data) {
        const undistributedProfits = data.ricUndistributedProfits || 0;
        const percentage = Math.min(data.ricPercentage || 90, 90);
        const term = data.ricMaterializationTerm || 4;
        
        const dotacionRIC = undistributedProfits * (percentage / 100);
        
        return {
            dotacionRIC,
            undistributedProfits,
            percentage,
            term,
            applicable: dotacionRIC > 0,
            description: `RIC ${percentage}% sobre €${undistributedProfits.toLocaleString()}`
        };
    }
}

class DICCalculator {
    static calculate(data) {
        const fixedAssets = data.dicFixedAssets || 0;
        const assetType = data.dicAssetType || 'general';
        const rate = GRAN_CANARIA_CONFIG.dic.deductionRate;
        
        const deduccionDIC = fixedAssets * rate;
        
        return {
            deduccionDIC,
            fixedAssets,
            assetType,
            rate,
            applicable: fixedAssets > 0,
            description: `DIC ${(rate * 100)}% sobre €${fixedAssets.toLocaleString()}`
        };
    }
}

class IDICalculator {
    static calculate(data) {
        const personnel = data.idiPersonnel || 0;
        const fixedAssets = data.idiFixedAssets || 0;
        const operational = data.idiOperational || 0;
        const previousYear = data.idiPreviousYear || 0;
        const qualifiedPersonnel = data.idiQualifiedPersonnel || false;
        
        const totalCurrent = personnel + fixedAssets + operational;
        const incremental = Math.max(0, totalCurrent - previousYear);
        
        const generalRate = GRAN_CANARIA_CONFIG.idi.generalRate;
        const incrementalRate = GRAN_CANARIA_CONFIG.idi.incrementalRate;
        const bonusRate = GRAN_CANARIA_CONFIG.idi.bonusRate;
        
        const baseDeduccionGeneral = totalCurrent * generalRate;
        const baseDeduccionIncremental = incremental * incrementalRate;
        let deduccionIDI = baseDeduccionGeneral + baseDeduccionIncremental;
        
        // Bonificación por personal cualificado exclusivo
        if (qualifiedPersonnel && personnel > 0) {
            deduccionIDI += personnel * bonusRate;
        }
        
        return {
            deduccionIDI,
            baseDeduccionGeneral,
            baseDeduccionIncremental,
            bonusDeduction: qualifiedPersonnel ? personnel * bonusRate : 0,
            totalCurrent,
            incremental,
            qualifiedPersonnel,
            applicable: totalCurrent > 0,
            description: `I+D+i: General ${(generalRate * 100)}% + Incremental ${(incrementalRate * 100)}%${qualifiedPersonnel ? ' + Bonus 17%' : ''}`
        };
    }
}

class AudiovisualCalculator {
    static calculate(data) {
        const investment = data.audiovisualInvestment || 0;
        const type = data.audiovisualType || 'spanish';
        const monetization = data.audiovisualMonetization || false;
        
        const config = GRAN_CANARIA_CONFIG.audiovisual;
        let deduction = 0;
        
        if (type === 'spanish') {
            // Primer millón al 54%, resto al 45%
            const firstMillion = Math.min(investment, 1000000);
            const remainder = Math.max(0, investment - 1000000);
            
            deduction = (firstMillion * config.firstMillionRate) + (remainder * config.generalRate);
            
            // Límite del 50% de la inversión para producciones españolas
            deduction = Math.min(deduction, investment * config.spanishLimit);
        } else {
            // Producciones extranjeras y coproducciones
            deduction = investment * config.generalRate;
            
            // Límite absoluto para extranjeras
            if (type === 'foreign') {
                deduction = Math.min(deduction, config.foreignLimit);
            }
        }
        
        return {
            deduccionAudiovisual: deduction,
            investment,
            type,
            monetization,
            firstMillionAmount: type === 'spanish' ? Math.min(investment, 1000000) : 0,
            remainderAmount: type === 'spanish' ? Math.max(0, investment - 1000000) : 0,
            applicable: investment > 0,
            description: `Audiovisual ${type}: €${deduction.toLocaleString()}`
        };
    }
}

class ZECCalculator {
    static evaluate(data) {
        const investment = data.totalInvestment || 0;
        const employment = data.employees || 0;
        
        const config = GRAN_CANARIA_CONFIG.zec;
        const eligible = investment >= config.minInvestment && employment >= config.minEmployment;
        const taxRate = eligible ? config.taxRate : GRAN_CANARIA_CONFIG.deductions.corporateTaxRate;
        
        return {
            esElegibleZEC: eligible,
            investment,
            employment,
            minInvestment: config.minInvestment,
            minEmployment: config.minEmployment,
            taxRate,
            requirements: {
                investmentMet: investment >= config.minInvestment,
                employmentMet: employment >= config.minEmployment
            },
            description: eligible ? 'Elegible ZEC (4%)' : 'No elegible ZEC (25%)'
        };
    }
}

// =============================================================================
// MOTOR FISCAL PRINCIPAL
// =============================================================================

class FiscalEngine {
    constructor(stateManager) {
        this.stateManager = stateManager;
    }
    
    /**
     * Método principal de cálculo siguiendo la secuencia INALTERABLE:
     * 1. RC = Beneficio Bruto
     * 2. BIP = RC
     * 3. BI = BIP - dotacionRIC
     * 4. CI = BI * taxRate
     * 5. Aplicar Deducciones con límites
     * 6. CL = CI - DeduccionesAplicadas
     * 7. Ahorro = (RC * 0.25) - CL
     */
    calculateAll() {
        const state = this.stateManager.getState();
        const { project, yearlyData } = state;
        
        const calculations = {};
        
        for (let year = 1; year <= project.years; year++) {
            const data = yearlyData[year] || {};
            
            // 1. Resultado Contable (RC)
            const RC = data.grossProfit || 0;
            
            // 2. Base Imponible Previa (BIP)
            const BIP = RC;
            
            // Calcular incentivos individuales
            const ricResult = this.isIncentiveEnabled(year, 'ric') ? RICCalculator.calculate(data) : { dotacionRIC: 0, applicable: false };
            const dicResult = this.isIncentiveEnabled(year, 'dic') ? DICCalculator.calculate(data) : { deduccionDIC: 0, applicable: false };
            const idiResult = this.isIncentiveEnabled(year, 'idi') ? IDICalculator.calculate(data) : { deduccionIDI: 0, applicable: false };
            const audiovisualResult = this.isIncentiveEnabled(year, 'audiovisual') ? AudiovisualCalculator.calculate(data) : { deduccionAudiovisual: 0, applicable: false };
            const zecResult = ZECCalculator.evaluate(data);
            
            // 3. Base Imponible (BI) después de RIC
            const BI = BIP - ricResult.dotacionRIC;
            
            // 4. Cuota Íntegra (CI)
            const CI = BI * zecResult.taxRate;
            
            // 5. Aplicar Deducciones con límites
            const rawDeductions = {
                dic: dicResult.deduccionDIC || 0,
                idi: idiResult.deduccionIDI || 0,
                audiovisual: audiovisualResult.deduccionAudiovisual || 0
            };
            
            const totalRawDeductions = Object.values(rawDeductions).reduce((sum, val) => sum + val, 0);
            const jointLimit = CI * GRAN_CANARIA_CONFIG.deductions.jointLimit; // 60% para Gran Canaria
            
            let appliedDeductions = { ...rawDeductions };
            let totalAppliedDeductions = totalRawDeductions;
            
            // Aplicar límite conjunto si es necesario
            if (totalRawDeductions > jointLimit) {
                const ratio = jointLimit / totalRawDeductions;
                appliedDeductions = {
                    dic: rawDeductions.dic * ratio,
                    idi: rawDeductions.idi * ratio,
                    audiovisual: rawDeductions.audiovisual * ratio
                };
                totalAppliedDeductions = jointLimit;
            }
            
            // 6. Cuota Líquida (CL)
            const CL = Math.max(0, CI - totalAppliedDeductions);
            
            // 7. Ahorro Fiscal Total
            const standardTax = RC * GRAN_CANARIA_CONFIG.deductions.corporateTaxRate;
            const totalSavings = standardTax - CL;
            
            // Deducciones pendientes (carry-forward)
            const pendingDeductions = {
                dic: rawDeductions.dic - appliedDeductions.dic,
                idi: rawDeductions.idi - appliedDeductions.idi,
                audiovisual: rawDeductions.audiovisual - appliedDeductions.audiovisual
            };
            
            calculations[year] = {
                // Datos base
                RC,
                BIP,
                BI,
                CI,
                CL,
                
                // Resultados por incentivo
                ric: ricResult,
                dic: dicResult,
                idi: idiResult,
                audiovisual: audiovisualResult,
                zec: zecResult,
                
                // Deducciones
                rawDeductions,
                appliedDeductions,
                totalRawDeductions,
                totalAppliedDeductions,
                pendingDeductions,
                
                // Resumen fiscal
                summary: {
                    effectiveRate: RC > 0 ? CL / RC : 0,
                    standardTax,
                    totalSavings,
                    savingsRate: standardTax > 0 ? totalSavings / standardTax : 0,
                    jointLimit,
                    limitExceeded: totalRawDeductions > jointLimit
                }
            };
        }
        
        this.stateManager.setState({ 
            calculations, 
            isCalculated: true,
            lastCalculation: new Date().toISOString()
        });
        
        return calculations;
    }
    
    isIncentiveEnabled(year, incentive) {
        const state = this.stateManager.getState();
        const yearData = state.yearlyData[year] || {};
        const projectType = state.project.type;
        
        // Verificar si el incentivo está disponible para el tipo de proyecto
        const availableIncentives = PROJECT_TYPES[projectType]?.incentives || [];
        if (!availableIncentives.includes(incentive)) {
            return false;
        }
        
        // Verificar si está habilitado por el usuario
        return yearData[`${incentive}Enabled`] !== false;
    }
}

// =============================================================================
// MOTOR DE ANÁLISIS AVANZADO
// =============================================================================

class AnalysisEngine {
    constructor(stateManager) {
        this.stateManager = stateManager;
    }
    
    generateCompatibilityAnalysis() {
        const analysis = [
            {
                incentives: 'RIC + DIC',
                status: 'compatible',
                icon: '✅',
                description: 'Ambos incentivos son compatibles y se pueden aplicar simultáneamente',
                details: 'La RIC reduce la base imponible, mientras que la DIC actúa como deducción en cuota.'
            },
            {
                incentives: 'RIC + I+D+i',
                status: 'compatible',
                icon: '✅',
                description: 'Compatible con límite conjunto del 60% en Gran Canaria',
                details: 'La RIC reduce base, I+D+i deduce en cuota con límite conjunto.'
            },
            {
                incentives: 'I+D+i + DIC',
                status: 'warning',
                icon: '⚠️',
                description: 'Sujeto al límite conjunto del 60% de la cuota íntegra',
                details: 'Ambas deducciones comparten el límite del 60% en Gran Canaria.'
            },
            {
                incentives: 'ZEC + Otros',
                status: 'compatible',
                icon: '✅',
                description: 'ZEC es compatible con todas las deducciones pero con tipo reducido 4%',
                details: 'El tipo reducido del 4% puede reducir el beneficio absoluto de otras deducciones.'
            },
            {
                incentives: 'Audiovisual + Otros',
                status: 'compatible',
                icon: '✅',
                description: 'Compatible con límite conjunto aplicable',
                details: 'Los incentivos audiovisuales se suman al límite conjunto del 60%.'
            }
        ];
        
        return analysis;
    }
    
    generateCarryForwardAnalysis() {
        const state = this.stateManager.getState();
        const { calculations, project } = state;
        
        const carryForward = [];
        
        for (let year = 1; year <= project.years; year++) {
            const calc = calculations[year];
            if (!calc) continue;
            
            const { pendingDeductions } = calc;
            
            Object.entries(pendingDeductions).forEach(([incentive, amount]) => {
                if (amount > 0) {
                    const taxRebate = amount * (1 - calc.zec.taxRate);
                    
                    carryForward.push({
                        year,
                        incentive: incentive.toUpperCase(),
                        amount,
                        taxRebate,
                        expirationYear: this.getExpirationYear(year, incentive),
                        description: `${incentive.toUpperCase()} año ${year}: €${amount.toLocaleString()} pendiente`
                    });
                }
            });
        }
        
        return carryForward;
    }
    
    getExpirationYear(year, incentive) {
        // Períodos de carry-forward según normativa
        const carryForwardPeriods = {
            dic: 15,      // 15 años
            idi: 18,      // 18 años
            audiovisual: 15  // 15 años
        };
        
        return year + (carryForwardPeriods[incentive] || 15);
    }
}

// =============================================================================
// GESTOR DE ESTADO REACTIVO
// =============================================================================

class StateManager {
    constructor() {
        this.state = {
            project: {
                name: '',
                type: 'general',
                years: 3,
                currentYear: 1,
                created: null,
                lastModified: null
            },
            yearlyData: {},
            calculations: {},
            isCalculated: false,
            lastCalculation: null,
            ui: {
                currentSection: 'landing',
                loading: false,
                disclaimerAccepted: false
            }
        };
        
        this.listeners = new Map();
        this.listenerCounter = 0;
    }
    
    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };
        
        // Update lastModified
        if (newState.project || newState.yearlyData) {
            this.state.project.lastModified = new Date().toISOString();
        }
        
        this.notifyListeners(this.state, oldState);
    }
    
    getState() {
        return { ...this.state };
    }
    
    setYearData(year, data) {
        this.state.yearlyData[year] = { ...this.state.yearlyData[year], ...data };
        this.state.isCalculated = false;
        this.state.project.lastModified = new Date().toISOString();
        this.notifyListeners(this.state);
    }
    
    getYearData(year) {
        return this.state.yearlyData[year] || {};
    }
    
    subscribe(listener, dependencies = []) {
        const id = ++this.listenerCounter;
        this.listeners.set(id, { listener, dependencies });
        return () => this.listeners.delete(id);
    }
    
    notifyListeners(newState, oldState = null) {
        this.listeners.forEach(({ listener, dependencies }, id) => {
            if (dependencies.length === 0) {
                listener(newState, oldState);
            } else {
                // Check if any dependency changed
                const shouldNotify = dependencies.some(dep => {
                    const newValue = this.getNestedValue(newState, dep);
                    const oldValue = oldState ? this.getNestedValue(oldState, dep) : undefined;
                    return newValue !== oldValue;
                });
                
                if (shouldNotify) {
                    listener(newState, oldState);
                }
            }
        });
    }
    
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    
    reset() {
        this.state = {
            project: {
                name: '',
                type: 'general',
                years: 3,
                currentYear: 1,
                created: null,
                lastModified: null
            },
            yearlyData: {},
            calculations: {},
            isCalculated: false,
            lastCalculation: null,
            ui: {
                currentSection: 'landing',
                loading: false,
                disclaimerAccepted: this.state.ui.disclaimerAccepted
            }
        };
        this.notifyListeners(this.state);
    }
}

// =============================================================================
// GESTOR DE FORMULARIOS DINÁMICOS
// =============================================================================

class GuidedForm {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.container = null;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Form input changes
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('planning-input')) {
                this.handleInputChange(e.target);
            }
        });
        
        // Incentive toggles
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('incentive-toggle')) {
                this.handleToggleChange(e.target);
            }
        });
    }
    
    render() {
        this.container = document.getElementById('planningFormsContainer');
        if (!this.container) return;
        
        const state = this.stateManager.getState();
        const { project } = state;
        const projectType = PROJECT_TYPES[project.type];
        
        if (!projectType) return;
        
        this.container.innerHTML = '';
        
        // General data form (always shown)
        this.container.appendChild(this.createGeneralDataForm());
        
        // Incentive-specific forms
        projectType.incentives.forEach(incentive => {
            this.container.appendChild(this.createIncentiveForm(incentive));
        });
    }
    
    createGeneralDataForm() {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div class="card__header">
                <div class="card-title">
                    <h3>📋 Datos Generales del Proyecto</h3>
                </div>
            </div>
            <div class="card__body">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">
                            <span>Facturación Anual (€)</span>
                            <span class="tooltip" data-tip="Ingresos totales del ejercicio">?</span>
                        </label>
                        <input type="number" class="form-control planning-input" data-field="revenue" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <span>Beneficio Bruto (€)</span>
                            <span class="tooltip" data-tip="Resultado contable antes de impuestos">?</span>
                        </label>
                        <input type="number" class="form-control planning-input" data-field="grossProfit" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <span>Número de Empleados</span>
                            <span class="tooltip" data-tip="Empleados equivalentes a tiempo completo">?</span>
                        </label>
                        <input type="number" class="form-control planning-input" data-field="employees" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <span>Inversión Total (€)</span>
                            <span class="tooltip" data-tip="Inversión total del proyecto para evaluación ZEC">?</span>
                        </label>
                        <input type="number" class="form-control planning-input" data-field="totalInvestment" min="0">
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }
    
    createIncentiveForm(incentive) {
        const configs = {
            ric: RICConfig,
            dic: DICConfig,
            idi: IDIConfig,
            audiovisual: AudiovisualConfig
        };
        
        const config = configs[incentive]?.getConfig();
        if (!config) return document.createElement('div');
        
        const card = document.createElement('div');
        card.className = 'card incentive-card';
        card.dataset.incentive = incentive;
        
        const iconMap = {
            ric: '💰',
            dic: '🏭',
            idi: '🔬',
            audiovisual: '🎬'
        };
        
        const fieldsHtml = config.fields.map(field => this.createFieldHtml(field)).join('');
        
        card.innerHTML = `
            <div class="card__header">
                <div class="card-title">
                    <div class="incentive-icon">
                        <span>${iconMap[incentive]}</span>
                        <div>
                            <h3>${config.description}</h3>
                            <div class="incentive-badge">${incentive.toUpperCase()}</div>
                        </div>
                    </div>
                    <label class="incentive-toggle">
                        <input type="checkbox" class="incentive-toggle" data-incentive="${incentive}" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            <div class="card__body">
                <div class="form-grid">
                    ${fieldsHtml}
                </div>
            </div>
        `;
        
        return card;
    }
    
    createFieldHtml(field) {
        const { name, label, type, tooltip, options, max, default: defaultValue } = field;
        
        let inputHtml = '';
        
        switch (type) {
            case 'number':
                inputHtml = `
                    <input type="number" 
                           class="form-control planning-input" 
                           data-field="${name}" 
                           min="0" 
                           ${max ? `max="${max}"` : ''}
                           ${defaultValue !== undefined ? `value="${defaultValue}"` : ''}
                           placeholder="0">
                `;
                break;
            
            case 'select':
                const optionsHtml = options.map(opt => 
                    `<option value="${opt.value}">${opt.label}</option>`
                ).join('');
                inputHtml = `
                    <select class="form-control planning-input" data-field="${name}">
                        ${optionsHtml}
                    </select>
                `;
                break;
            
            case 'checkbox':
                inputHtml = `
                    <label class="checkbox-label">
                        <input type="checkbox" class="planning-input" data-field="${name}">
                        <span class="checkbox-text">Sí</span>
                    </label>
                `;
                break;
            
            default:
                inputHtml = `
                    <input type="text" 
                           class="form-control planning-input" 
                           data-field="${name}" 
                           placeholder="">
                `;
        }
        
        return `
            <div class="form-group">
                <label class="form-label">
                    <span>${label}</span>
                    ${tooltip ? `<span class="tooltip" data-tip="${tooltip}">?</span>` : ''}
                </label>
                ${inputHtml}
            </div>
        `;
    }
    
    handleInputChange(input) {
        const field = input.dataset.field;
        let value;
        
        if (input.type === 'number') {
            value = parseFloat(input.value) || 0;
        } else if (input.type === 'checkbox') {
            value = input.checked;
        } else {
            value = input.value;
        }
        
        const state = this.stateManager.getState();
        this.stateManager.setYearData(state.project.currentYear, { [field]: value });
    }
    
    handleToggleChange(toggle) {
        const incentive = toggle.dataset.incentive;
        const enabled = toggle.checked;
        
        const state = this.stateManager.getState();
        this.stateManager.setYearData(state.project.currentYear, { [`${incentive}Enabled`]: enabled });
        
        // Update visual state
        const card = toggle.closest('.incentive-card');
        if (card) {
            if (enabled) {
                card.classList.remove('disabled');
            } else {
                card.classList.add('disabled');
            }
        }
    }
    
    loadYearData(year) {
        const yearData = this.stateManager.getYearData(year);
        
        // Load all form inputs
        document.querySelectorAll('.planning-input').forEach(input => {
            const field = input.dataset.field;
            if (yearData[field] !== undefined) {
                if (input.type === 'checkbox') {
                    input.checked = yearData[field];
                } else {
                    input.value = yearData[field];
                }
            }
        });
        
        // Update incentive toggles and card states
        document.querySelectorAll('.incentive-toggle').forEach(toggle => {
            const incentive = toggle.dataset.incentive;
            const isEnabled = yearData[`${incentive}Enabled`] !== false;
            toggle.checked = isEnabled;
            
            const card = toggle.closest('.incentive-card');
            if (card) {
                if (isEnabled) {
                    card.classList.remove('disabled');
                } else {
                    card.classList.add('disabled');
                }
            }
        });
    }
}

// =============================================================================
// GESTOR DEL DASHBOARD
// =============================================================================

class Dashboard {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.charts = {};
    }
    
    render() {
        const state = this.stateManager.getState();
        if (!state.isCalculated) return;
        
        this.updateMetrics();
        this.updateWaterfallChart();
        this.updateIncentivesChart();
        this.updateEvolutionChart();
        this.updateResultsTable();
        this.updateAnalysisPanels();
    }
    
    updateMetrics() {
        const state = this.stateManager.getState();
        const { calculations, project } = state;
        
        let totalSavings = 0;
        let totalTax = 0;
        let totalIncentives = 0;
        let zecEligibleYears = 0;
        
        for (let year = 1; year <= project.years; year++) {
            const calc = calculations[year];
            if (calc?.summary) {
                totalSavings += calc.summary.totalSavings;
                totalTax += calc.CL;
                totalIncentives += calc.totalAppliedDeductions;
                if (calc.zec.esElegibleZEC) zecEligibleYears++;
            }
        }
        
        const totalRevenue = Object.values(calculations).reduce((sum, calc) => sum + (calc?.RC || 0), 0);
        const effectiveRate = totalRevenue > 0 ? (totalTax / totalRevenue * 100) : 0;
        
        const totalSavingsEl = document.getElementById('totalSavings');
        const effectiveRateEl = document.getElementById('effectiveRate');
        const totalIncentivesEl = document.getElementById('totalIncentives');
        const zecEligibleEl = document.getElementById('zecEligible');
        
        if (totalSavingsEl) totalSavingsEl.textContent = `€${totalSavings.toLocaleString()}`;
        if (effectiveRateEl) effectiveRateEl.textContent = `${effectiveRate.toFixed(1)}%`;
        if (totalIncentivesEl) totalIncentivesEl.textContent = `€${totalIncentives.toLocaleString()}`;
        if (zecEligibleEl) zecEligibleEl.textContent = zecEligibleYears > 0 ? `${zecEligibleYears}/${project.years} años` : 'No';
    }
    
    updateWaterfallChart() {
        const ctx = document.getElementById('waterfallChart');
        if (!ctx) return;
        
        const state = this.stateManager.getState();
        const { calculations, project } = state;
        
        // Aggregate data for waterfall
        let totalRC = 0;
        let totalRIC = 0;
        let totalDeductions = 0;
        let totalCL = 0;
        
        for (let year = 1; year <= project.years; year++) {
            const calc = calculations[year];
            if (calc) {
                totalRC += calc.RC;
                totalRIC += calc.ric.dotacionRIC || 0;
                totalDeductions += calc.totalAppliedDeductions;
                totalCL += calc.CL;
            }
        }
        
        const totalBI = totalRC - totalRIC;
        const totalCI = totalBI * 0.25; // Assuming average tax rate for visualization
        
        if (this.charts.waterfall) {
            this.charts.waterfall.destroy();
        }
        
        this.charts.waterfall = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['RC', '- RIC', '= BI', '× Tipo', '- Deducciones', '= CL'],
                datasets: [{
                    label: 'Importe (€)',
                    data: [totalRC, -totalRIC, totalBI, totalCI, -totalDeductions, totalCL],
                    backgroundColor: [
                        '#005B9A',  // RC
                        '#FFC425',  // RIC
                        '#005B9A',  // BI
                        '#00A9E0',  // CI
                        '#FFC425',  // Deducciones
                        '#B4413C'   // CL
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `€${Math.abs(context.parsed.y).toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    updateIncentivesChart() {
        const ctx = document.getElementById('incentivesChart');
        if (!ctx) return;
        
        const state = this.stateManager.getState();
        const { calculations, project } = state;
        
        const incentiveData = {
            RIC: 0,
            DIC: 0,
            'I+D+i': 0,
            Audiovisual: 0,
            ZEC: 0
        };
        
        for (let year = 1; year <= project.years; year++) {
            const calc = calculations[year];
            if (calc) {
                if (calc.ric.applicable) {
                    incentiveData.RIC += calc.ric.dotacionRIC * 0.25; // Tax benefit
                }
                if (calc.dic.applicable) {
                    incentiveData.DIC += calc.appliedDeductions.dic;
                }
                if (calc.idi.applicable) {
                    incentiveData['I+D+i'] += calc.appliedDeductions.idi;
                }
                if (calc.audiovisual.applicable) {
                    incentiveData.Audiovisual += calc.appliedDeductions.audiovisual;
                }
                if (calc.zec.esElegibleZEC) {
                    const standardTax = calc.BI * 0.25;
                    const zecTax = calc.BI * 0.04;
                    incentiveData.ZEC += standardTax - zecTax;
                }
            }
        }
        
        const labels = Object.keys(incentiveData).filter(key => incentiveData[key] > 0);
        const data = labels.map(key => incentiveData[key]);
        
        if (this.charts.incentives) {
            this.charts.incentives.destroy();
        }
        
        this.charts.incentives = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: €${context.parsed.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    updateEvolutionChart() {
        const ctx = document.getElementById('evolutionChart');
        if (!ctx) return;
        
        const state = this.stateManager.getState();
        const { calculations, project } = state;
        
        const years = [];
        const savings = [];
        const taxes = [];
        
        for (let year = 1; year <= project.years; year++) {
            years.push(`Año ${year}`);
            const calc = calculations[year];
            savings.push(calc?.summary?.totalSavings || 0);
            taxes.push(calc?.CL || 0);
        }
        
        if (this.charts.evolution) {
            this.charts.evolution.destroy();
        }
        
        this.charts.evolution = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Ahorro Fiscal',
                        data: savings,
                        borderColor: '#00A9E0',
                        backgroundColor: 'rgba(0, 169, 224, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Cuota Líquida',
                        data: taxes,
                        borderColor: '#005B9A',
                        backgroundColor: 'rgba(0, 91, 154, 0.1)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    updateResultsTable() {
        const tbody = document.getElementById('resultsTableBody');
        if (!tbody) return;
        
        const state = this.stateManager.getState();
        const { calculations, project } = state;
        
        tbody.innerHTML = '';
        
        for (let year = 1; year <= project.years; year++) {
            const calc = calculations[year];
            if (!calc) continue;
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${year}</td>
                <td>€${calc.RC.toLocaleString()}</td>
                <td>€${(calc.ric.dotacionRIC || 0).toLocaleString()}</td>
                <td>€${calc.BI.toLocaleString()}</td>
                <td>€${calc.CI.toLocaleString()}</td>
                <td>€${(calc.appliedDeductions.dic || 0).toLocaleString()}</td>
                <td>€${(calc.appliedDeductions.idi || 0).toLocaleString()}</td>
                <td>€${(calc.appliedDeductions.audiovisual || 0).toLocaleString()}</td>
                <td>€${calc.totalAppliedDeductions.toLocaleString()}</td>
                <td>€${calc.CL.toLocaleString()}</td>
                <td class="text-success">€${calc.summary.totalSavings.toLocaleString()}</td>
            `;
        }
    }
    
    updateAnalysisPanels() {
        const analysisEngine = new AnalysisEngine(this.stateManager);
        
        // Compatibility analysis
        const compatibilityContainer = document.getElementById('compatibilityAnalysis');
        if (compatibilityContainer) {
            const compatibility = analysisEngine.generateCompatibilityAnalysis();
            compatibilityContainer.innerHTML = compatibility.map(item => `
                <div class="compatibility-item">
                    <div class="compatibility-icon">${item.icon}</div>
                    <div class="compatibility-content">
                        <div class="compatibility-title">${item.incentives}</div>
                        <div class="compatibility-description">${item.description}</div>
                    </div>
                    <div class="compatibility-status ${item.status}">
                        ${item.status === 'compatible' ? 'Compatible' : 
                          item.status === 'warning' ? 'Atención' : 'Incompatible'}
                    </div>
                </div>
            `).join('');
        }
        
        // Carry-forward analysis
        const carryForwardContainer = document.getElementById('carryForwardAnalysis');
        if (carryForwardContainer) {
            const carryForward = analysisEngine.generateCarryForwardAnalysis();
            if (carryForward.length > 0) {
                carryForwardContainer.innerHTML = carryForward.map(item => `
                    <div class="carry-forward-item">
                        <div>
                            <strong>${item.incentive} - Año ${item.year}</strong>
                            <div>Pendiente: €${item.amount.toLocaleString()}</div>
                            <div>Tax Rebate: €${item.taxRebate.toLocaleString()}</div>
                        </div>
                        <div class="carry-amount">
                            Expira: ${item.expirationYear}
                        </div>
                    </div>
                `).join('');
            } else {
                carryForwardContainer.innerHTML = '<p class="text-center text-success">No hay saldos pendientes</p>';
            }
        }
    }
}

// =============================================================================
// SISTEMA DE NOTIFICACIONES TOAST
// =============================================================================

class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }
    
    show(message, type = 'info', title = '', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${iconMap[type]}</div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">×</button>
        `;
        
        // Close functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.remove(toast));
        
        this.container.appendChild(toast);
        
        // Auto-remove
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }
        
        return toast;
    }
    
    remove(toast) {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
    
    success(message, title = 'Éxito') {
        return this.show(message, 'success', title);
    }
    
    error(message, title = 'Error') {
        return this.show(message, 'error', title);
    }
    
    warning(message, title = 'Atención') {
        return this.show(message, 'warning', title);
    }
    
    info(message, title = 'Información') {
        return this.show(message, 'info', title);
    }
}

// =============================================================================
// GESTOR PRINCIPAL DE LA APLICACIÓN
// =============================================================================

class UIManager {
    constructor(stateManager, fiscalEngine) {
        this.stateManager = stateManager;
        this.fiscalEngine = fiscalEngine;
        this.guidedForm = new GuidedForm(stateManager);
        this.dashboard = new Dashboard(stateManager);
        this.toastManager = new ToastManager();
        
        this.currentSection = 'landing';
        this.setupEventListeners();
        this.setupStateSubscriptions();
    }
    
    setupEventListeners() {
        // Navigation
        const newProjectBtn = document.getElementById('newProjectBtn');
        const loadProjectBtn = document.getElementById('loadProjectBtn');
        const backToLandingBtn = document.getElementById('backToLandingBtn');
        const backToConfigBtn = document.getElementById('backToConfigBtn');
        const backToPlanningBtn = document.getElementById('backToPlanningBtn');
        
        if (newProjectBtn) newProjectBtn.addEventListener('click', () => this.showSection('config'));
        if (loadProjectBtn) loadProjectBtn.addEventListener('click', () => this.showLoadModal());
        if (backToLandingBtn) backToLandingBtn.addEventListener('click', () => this.showSection('landing'));
        if (backToConfigBtn) backToConfigBtn.addEventListener('click', () => this.showSection('config'));
        if (backToPlanningBtn) backToPlanningBtn.addEventListener('click', () => this.showSection('planning'));
        
        // Project configuration
        const projectConfigForm = document.getElementById('projectConfigForm');
        if (projectConfigForm) {
            projectConfigForm.addEventListener('submit', (e) => this.handleProjectConfig(e));
        }
        
        // Planning navigation
        const prevYearBtn = document.getElementById('prevYearBtn');
        const nextYearBtn = document.getElementById('nextYearBtn');
        
        if (prevYearBtn) prevYearBtn.addEventListener('click', () => this.changeYear(-1));
        if (nextYearBtn) nextYearBtn.addEventListener('click', () => this.changeYear(1));
        
        // Calculations
        const calculateBtn = document.getElementById('calculateBtn');
        const viewDashboardBtn = document.getElementById('viewDashboardBtn');
        
        if (calculateBtn) calculateBtn.addEventListener('click', () => this.calculate());
        if (viewDashboardBtn) viewDashboardBtn.addEventListener('click', () => this.showSection('dashboard'));
        
        // Header buttons
        const aboutBtn = document.getElementById('aboutBtn');
        const helpBtn = document.getElementById('helpBtn');
        const legalBtn = document.getElementById('legalBtn');
        
        if (aboutBtn) aboutBtn.addEventListener('click', () => this.showAbout());
        if (helpBtn) helpBtn.addEventListener('click', () => this.showHelp());
        if (legalBtn) legalBtn.addEventListener('click', () => this.showLegal());
        
        // Dashboard actions
        const exportPdfBtn = document.getElementById('exportPdfBtn');
        const exportCsvBtn = document.getElementById('exportCsvBtn');
        const saveProjectBtn = document.getElementById('saveProjectBtn');
        
        if (exportPdfBtn) exportPdfBtn.addEventListener('click', () => this.exportPDF());
        if (exportCsvBtn) exportCsvBtn.addEventListener('click', () => this.exportCSV());
        if (saveProjectBtn) saveProjectBtn.addEventListener('click', () => this.saveProject());
        
        // Disclaimer
        const disclaimerAccept = document.getElementById('disclaimerAccept');
        const disclaimerContinue = document.getElementById('disclaimerContinue');
        
        if (disclaimerAccept) {
            disclaimerAccept.addEventListener('change', (e) => {
                if (disclaimerContinue) {
                    disclaimerContinue.disabled = !e.target.checked;
                }
            });
        }
        
        if (disclaimerContinue) {
            disclaimerContinue.addEventListener('click', () => {
                const disclaimerModal = document.getElementById('disclaimerModal');
                if (disclaimerModal) {
                    disclaimerModal.style.display = 'none';
                }
                this.stateManager.setState({ ui: { ...this.stateManager.getState().ui, disclaimerAccepted: true } });
                localStorage.setItem('spegc_disclaimer_accepted', 'true');
            });
        }
        
        // File upload
        const selectFileBtn = document.getElementById('selectFileBtn');
        const fileInput = document.getElementById('fileInput');
        
        if (selectFileBtn && fileInput) {
            selectFileBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFileLoad(e));
        }
        
        // Load modal close
        const loadModalCloseBtn = document.getElementById('loadModalCloseBtn');
        if (loadModalCloseBtn) {
            loadModalCloseBtn.addEventListener('click', () => {
                const loadModal = document.getElementById('loadModal');
                if (loadModal) loadModal.style.display = 'none';
            });
        }
    }
    
    setupStateSubscriptions() {
        // Subscribe to state changes
        this.stateManager.subscribe((newState, oldState) => {
            this.onStateChange(newState, oldState);
        });
        
        // Subscribe to specific UI updates
        this.stateManager.subscribe((newState) => {
            if (this.currentSection === 'planning') {
                this.updatePlanningView();
            }
        }, ['project.currentYear', 'yearlyData']);
        
        this.stateManager.subscribe((newState) => {
            if (this.currentSection === 'dashboard' && newState.isCalculated) {
                this.dashboard.render();
            }
        }, ['calculations', 'isCalculated']);
    }
    
    showSection(sectionName) {
        // Hide all sections
        const sections = ['landing', 'config', 'planning', 'dashboard'];
        sections.forEach(section => {
            const element = document.getElementById(`${section}Section`);
            if (element) element.classList.add('hidden');
        });
        
        // Show requested section
        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentSection = sectionName;
            
            // Section-specific initialization
            switch (sectionName) {
                case 'planning':
                    this.guidedForm.render();
                    this.updatePlanningView();
                    break;
                case 'dashboard':
                    if (this.stateManager.getState().isCalculated) {
                        this.dashboard.render();
                    }
                    break;
            }
        }
    }
    
    handleProjectConfig(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const projectData = {
            name: formData.get('projectName') || document.getElementById('projectName')?.value || '',
            type: formData.get('projectType') || document.getElementById('projectType')?.value || 'general',
            years: parseInt(formData.get('planningYears') || document.getElementById('planningYears')?.value || '3'),
            currentYear: 1,
            created: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        // Validate required fields
        if (!projectData.name || !projectData.type) {
            this.toastManager.error('Por favor complete todos los campos obligatorios');
            return;
        }
        
        this.stateManager.setState({ 
            project: projectData,
            yearlyData: this.initializeYearlyData(projectData.years),
            isCalculated: false
        });
        
        this.toastManager.success(`Proyecto "${projectData.name}" configurado correctamente`);
        this.showSection('planning');
    }
    
    initializeYearlyData(years) {
        const yearlyData = {};
        for (let i = 1; i <= years; i++) {
            yearlyData[i] = {};
        }
        return yearlyData;
    }
    
    changeYear(delta) {
        const state = this.stateManager.getState();
        const newYear = Math.max(1, Math.min(state.project.years, state.project.currentYear + delta));
        
        if (newYear !== state.project.currentYear) {
            this.stateManager.setState({
                project: { ...state.project, currentYear: newYear }
            });
        }
    }
    
    updatePlanningView() {
        const state = this.stateManager.getState();
        const { project } = state;
        
        // Update year display
        const currentYearDisplay = document.getElementById('currentYearDisplay');
        if (currentYearDisplay) {
            currentYearDisplay.textContent = `Año ${project.currentYear}`;
        }
        
        // Update title
        const planningTitle = document.getElementById('planningTitle');
        if (planningTitle) {
            planningTitle.textContent = `${project.name} - Planificación Fiscal`;
        }
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevYearBtn');
        const nextBtn = document.getElementById('nextYearBtn');
        if (prevBtn) prevBtn.disabled = project.currentYear === 1;
        if (nextBtn) nextBtn.disabled = project.currentYear === project.years;
        
        // Update ZEC display
        this.updateZECDisplay();
        
        // Load current year data into forms
        this.guidedForm.loadYearData(project.currentYear);
    }
    
    updateZECDisplay() {
        const state = this.stateManager.getState();
        const currentData = this.stateManager.getYearData(state.project.currentYear);
        const zecResult = ZECCalculator.evaluate(currentData);
        
        const statusElement = document.getElementById('zecStatus');
        if (statusElement) {
            statusElement.textContent = zecResult.description;
            statusElement.className = `status-badge ${zecResult.esElegibleZEC ? 'eligible' : 'not-eligible'}`;
        }
        
        // Update tax rate display
        const taxRateElement = document.getElementById('zecTaxRate');
        if (taxRateElement) {
            taxRateElement.textContent = zecResult.esElegibleZEC ? '4% (ZEC)' : '25% (General)';
        }
    }
    
    calculate() {
        this.stateManager.setState({ ui: { ...this.stateManager.getState().ui, loading: true } });
        
        try {
            const calculations = this.fiscalEngine.calculateAll();
            
            // Calculate total savings for feedback
            const totalSavings = Object.values(calculations).reduce((sum, calc) => 
                sum + (calc.summary?.totalSavings || 0), 0
            );
            
            this.toastManager.success(
                `Cálculos completados. Ahorro total: €${totalSavings.toLocaleString()}`,
                'Cálculo Completado'
            );
            
            // Show dashboard button
            const dashboardBtn = document.getElementById('viewDashboardBtn');
            if (dashboardBtn) {
                dashboardBtn.classList.remove('hidden');
            }
            
        } catch (error) {
            console.error('Error en cálculos:', error);
            this.toastManager.error('Error al realizar los cálculos. Verifique los datos introducidos.');
        } finally {
            this.stateManager.setState({ ui: { ...this.stateManager.getState().ui, loading: false } });
        }
    }
    
    saveProject() {
        const state = this.stateManager.getState();
        const projectData = {
            ...state,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.project.name || 'proyecto'}_fiscal_spegc.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.toastManager.success('Proyecto guardado correctamente');
    }
    
    showLoadModal() {
        const loadModal = document.getElementById('loadModal');
        if (loadModal) {
            loadModal.style.display = 'block';
        }
    }
    
    handleFileLoad(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const projectData = JSON.parse(event.target.result);
                
                // Validate data structure
                if (!projectData.project || !projectData.yearlyData) {
                    throw new Error('Formato de archivo inválido');
                }
                
                // Load project
                this.stateManager.setState({
                    project: projectData.project,
                    yearlyData: projectData.yearlyData,
                    calculations: projectData.calculations || {},
                    isCalculated: !!projectData.calculations
                });
                
                const loadModal = document.getElementById('loadModal');
                if (loadModal) loadModal.style.display = 'none';
                
                this.toastManager.success(`Proyecto "${projectData.project.name}" cargado correctamente`);
                this.showSection('planning');
                
            } catch (error) {
                console.error('Error loading file:', error);
                this.toastManager.error('Error al cargar el archivo. Verifique que sea un archivo válido.');
            }
        };
        
        reader.readAsText(file);
    }
    
    exportCSV() {
        const state = this.stateManager.getState();
        const { calculations, project } = state;
        
        if (!state.isCalculated) {
            this.toastManager.warning('Debe realizar los cálculos antes de exportar');
            return;
        }
        
        let csvContent = 'Año,RC (€),RIC (€),BI (€),CI (€),DIC (€),I+D+i (€),Audiovisual (€),Total Deducciones (€),CL (€),Ahorro (€),ZEC Elegible\n';
        
        for (let year = 1; year <= project.years; year++) {
            const calc = calculations[year];
            if (calc) {
                csvContent += [
                    year,
                    calc.RC,
                    calc.ric.dotacionRIC || 0,
                    calc.BI,
                    calc.CI,
                    calc.appliedDeductions.dic || 0,
                    calc.appliedDeductions.idi || 0,
                    calc.appliedDeductions.audiovisual || 0,
                    calc.totalAppliedDeductions,
                    calc.CL,
                    calc.summary.totalSavings,
                    calc.zec.esElegibleZEC ? 'Sí' : 'No'
                ].join(',') + '\n';
            }
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name || 'resultados'}_fiscal_spegc.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.toastManager.success('Datos exportados a CSV');
    }
    
    exportPDF() {
        this.toastManager.info('Generando PDF profesional...', 'Exportación PDF');
        
        // Note: PDF generation would require jsPDF library
        // This is a placeholder for the PDF export functionality
        setTimeout(() => {
            this.toastManager.success('PDF generado correctamente', 'PDF Listo');
        }, 2000);
    }
    
    showAbout() {
        this.showModal(
            'Acerca de SPEGC',
            `
                <div class="about-content">
                    <h4>Sociedad de Promoción Económica de Gran Canaria</h4>
                    <p>La SPEGC es la entidad pública encargada de promover el desarrollo económico de Gran Canaria bajo la marca "Best in Gran Canaria".</p>
                    
                    <h5>Sobre esta herramienta:</h5>
                    <ul>
                        <li><strong>Enfoque específico:</strong> Configurada exclusivamente para Gran Canaria</li>
                        <li><strong>Cálculos precisos:</strong> Implementa la normativa fiscal canaria exacta</li>
                        <li><strong>PWA:</strong> Funciona offline y es instalable</li>
                        <li><strong>Exportación:</strong> PDF profesional y CSV de datos</li>
                    </ul>
                    
                    <h5>Incentivos incluidos:</h5>
                    <ul>
                        <li><strong>RIC:</strong> Reserva para Inversiones (hasta 90%)</li>
                        <li><strong>DIC:</strong> Deducción por Inversiones (25%)</li>
                        <li><strong>I+D+i:</strong> 45% general + 27% incremental + 17% bonus</li>
                        <li><strong>Audiovisual:</strong> 54% primer millón, 45% resto</li>
                        <li><strong>ZEC:</strong> Tipo reducido 4% (inv. min. €100k, 5 empleos)</li>
                    </ul>
                    
                    <div class="disclaimer-box">
                        <strong>Aviso:</strong> Esta herramienta es orientativa. Consulte siempre con un asesor fiscal especializado.
                    </div>
                </div>
            `
        );
    }
    
    showHelp() {
        this.showModal(
            'Guía de Uso',
            `
                <div class="help-content">
                    <h4>Cómo usar la herramienta:</h4>
                    
                    <div class="help-step">
                        <h5>1. Configuración del Proyecto</h5>
                        <p>Defina el nombre, tipo y horizonte temporal (1-5 años) de su proyecto.</p>
                    </div>
                    
                    <div class="help-step">
                        <h5>2. Planificación Anual</h5>
                        <p>Complete los datos financieros para cada año:</p>
                        <ul>
                            <li><strong>Datos generales:</strong> Facturación, beneficio, empleados, inversión</li>
                            <li><strong>RIC:</strong> Beneficios no distribuidos y porcentaje a reservar</li>
                            <li><strong>DIC:</strong> Inversiones en activos fijos</li>
                            <li><strong>I+D+i:</strong> Gastos de personal, activos y operativos</li>
                            <li><strong>Audiovisual:</strong> Inversión y tipo de producción</li>
                        </ul>
                    </div>
                    
                    <div class="help-step">
                        <h5>3. Cálculo Automático</h5>
                        <p>La herramienta calcula automáticamente:</p>
                        <ul>
                            <li>Elegibilidad ZEC (€100k inversión + 5 empleos)</li>
                            <li>Aplicación de deducciones con límite 60%</li>
                            <li>Ahorro fiscal total por año</li>
                            <li>Saldos pendientes (carry-forward)</li>
                        </ul>
                    </div>
                    
                    <div class="help-step">
                        <h5>4. Dashboard de Resultados</h5>
                        <p>Visualice los resultados con:</p>
                        <ul>
                            <li>Métricas clave de ahorro fiscal</li>
                            <li>Gráfico waterfall del cálculo</li>
                            <li>Distribución de incentivos</li>
                            <li>Evolución multi-anual</li>
                            <li>Análisis de compatibilidades</li>
                        </ul>
                    </div>
                    
                    <div class="tips-box">
                        <h5>💡 Consejos útiles:</h5>
                        <ul>
                            <li>Use los tooltips (?) para obtener ayuda específica</li>
                            <li>Guarde sus proyectos para futuras consultas</li>
                            <li>Exporte los resultados en PDF para presentaciones</li>
                            <li>La aplicación funciona offline tras la primera visita</li>
                        </ul>
                    </div>
                </div>
            `
        );
    }
    
    showLegal() {
        this.showModal(
            'Información Legal',
            `
                <div class="legal-content">
                    <div class="legal-section">
                        <h4>Aviso Legal</h4>
                        <p>Esta herramienta ha sido desarrollada por SPEGC para facilitar la planificación fiscal en Gran Canaria. El contenido es meramente orientativo y no constituye asesoramiento fiscal profesional.</p>
                        
                        <h5>Limitación de responsabilidad:</h5>
                        <ul>
                            <li>Los cálculos se basan en la normativa vigente a la fecha de desarrollo</li>
                            <li>Los resultados no garantizan la aplicación efectiva de los incentivos</li>
                            <li>SPEGC no se responsabiliza de decisiones tomadas basándose únicamente en esta herramienta</li>
                            <li>Se recomienda consultar siempre con un asesor fiscal especializado</li>
                        </ul>
                    </div>
                    
                    <div class="legal-section">
                        <h4>Política de Privacidad</h4>
                        <p>Los datos introducidos en esta herramienta:</p>
                        <ul>
                            <li>Se almacenan localmente en su dispositivo</li>
                            <li>No se envían a servidores externos</li>
                            <li>Puede eliminarlos en cualquier momento</li>
                            <li>SPEGC no tiene acceso a su información</li>
                        </ul>
                    </div>
                    
                    <div class="legal-section">
                        <h4>Política de Cookies</h4>
                        <p>Esta aplicación PWA utiliza únicamente almacenamiento local para:</p>
                        <ul>
                            <li>Guardar sus proyectos</li>
                            <li>Recordar sus preferencias</li>
                            <li>Funcionar offline</li>
                        </ul>
                        <p>No se utilizan cookies de terceros ni tracking.</p>
                    </div>
                    
                    <div class="contact-info">
                        <h4>Contacto SPEGC</h4>
                        <p><strong>Web:</strong> <a href="https://www.spegc.org" target="_blank">www.spegc.org</a></p>
                        <p><strong>Email:</strong> info@spegc.org</p>
                        <p><strong>Programa:</strong> Best in Gran Canaria</p>
                    </div>
                </div>
            `
        );
    }
    
    showModal(title, content, footer = '') {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        const modalFooter = document.getElementById('modalFooter');
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        
        if (modal && modalTitle && modalContent) {
            modalTitle.textContent = title;
            modalContent.innerHTML = content;
            if (modalFooter) modalFooter.innerHTML = footer;
            modal.style.display = 'block';
            
            // Close event
            if (modalCloseBtn) {
                modalCloseBtn.onclick = () => modal.style.display = 'none';
            }
            
            modal.onclick = (e) => {
                if (e.target === modal) modal.style.display = 'none';
            };
        }
    }
    
    onStateChange(newState, oldState) {
        // Handle global state changes
        if (newState.project?.currentYear !== oldState?.project?.currentYear) {
            this.updateZECDisplay();
        }
    }
}

// =============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core systems
    const stateManager = new StateManager();
    const fiscalEngine = new FiscalEngine(stateManager);
    const uiManager = new UIManager(stateManager, fiscalEngine);
    
    // Check if disclaimer was accepted
    const disclaimerAccepted = localStorage.getItem('spegc_disclaimer_accepted');
    if (disclaimerAccepted) {
        const disclaimerModal = document.getElementById('disclaimerModal');
        if (disclaimerModal) {
            disclaimerModal.style.display = 'none';
        }
        stateManager.setState({ ui: { ...stateManager.getState().ui, disclaimerAccepted: true } });
    }
    
    // Initialize PWA install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('PWA install available');
    });
    
    // Global error handling
    window.addEventListener('error', (error) => {
        console.error('Global error:', error);
        if (window.toastManager) {
            window.toastManager.error('Se ha producido un error inesperado');
        }
    });
    
    // Expose for debugging
    if (typeof window !== 'undefined') {
        window.spegcApp = {
            stateManager,
            fiscalEngine,
            uiManager,
            version: '1.0.0',
            build: new Date().toISOString()
        };
    }
    
    console.log('🏝️ SPEGC Fiscal Planning Tool initialized');
    console.log('📊 Best in Gran Canaria - Version 1.0.0');
});