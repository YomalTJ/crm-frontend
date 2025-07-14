/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import Select from '../form/Select'
import { BoxIcon, ChevronDownIcon } from '@/icons'
import Radio from '../form/input/Radio';
import Checkbox from '../form/input/Checkbox';
import Button from '../ui/button/Button';
import { createSamurdhiFamily } from '@/services/samurdhiService';

const SamurdhiFamillyForm = () => {
    const divisionalSecretariatDivisions = [
        { value: "addalaichenai", label: "Addalaichenai" },
        { value: "akalakulam", label: "Akkaraipattu" },
        { value: "alayadivembu", label: "Alayadivembu" },
        { value: "ampara", label: "Ampara" },
        { value: "damana", label: "Damana" },
        { value: "dehiattakandiya", label: "Dehiattakandiya" },
        { value: "irakkamam", label: "Irakkamam" },
        { value: "kalmunai", label: "Kalmunai" },
        { value: "karaitivu", label: "Karaitivu" },
        { value: "lahugala", label: "Lahugala" },
        { value: "mahaoya", label: "Maha Oya" },
        { value: "navithanveli", label: "Navithanveli" },
        { value: "ninthavur", label: "Ninthavur" },
        { value: "padiyatalawa", label: "Padiyatalawa" },
        { value: "sainthamaruthu", label: "Sainthamaruthu" },
        { value: "sammanthurai", label: "Sammanthurai" },
        { value: "thirukkovil", label: "Thirukkovil" },
        { value: "ulamamdu", label: "Uhana" }
    ];

    const [selectedValue, setSelectedValue] = useState<string>("Previous Samurdhi beneficiary /Low income earner");
    const [selectedProjectValue] = useState<string>("Previous Samurdhi beneficiary /Low income earner");
    const [isChecked, setIsChecked] = useState(false);

    const [formData, setFormData] = useState({
        district: '',
        divisionalSecretariat: '',
        samurdhiBank: '',
        gramaNiladhariDivision: '',
        beneficiaryType: 'Previous Samurdhi beneficiary /Low income earner',
        aswasumaHouseholdNo: '',
        nic: '',
        beneficiaryName: '',
        gender: 'Male',
        address: '',
        phone: '',
        projectOwnerAge: 0,
        male18To60: 0,
        female18To60: 0,
        currentEmployment: '',
        otherOccupation: '',
        samurdhiSubsidy: '',
        aswasumaCategory: '',
        empowermentDimension: '',
        projectType: '',
        otherProject: '',
        resourcesNeeded: [] as string[],
        monthlySaving: false,
        savingAmount: 0,
        healthInfo: [] as string[],
        domesticDynamics: [] as string[],
        communityParticipation: [] as string[],
        housingServices: [] as string[],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const samurdhiBanks = [
        { value: "ampara", label: "Ampara" },
        { value: "namaloya", label: "Namaloya" },
    ];

    const gramaNiladhariOptions = [
        { value: "dorakumbura", label: "Dorakumbura" },
        { value: "galode", label: "Galode" },
        { value: "hagamwela", label: "Hagamwela" },
        { value: "holike", label: "Holike" },
        { value: "kehelulla", label: "Kehelulla" },
        { value: "kirawana", label: "Kirawana" },
        { value: "kolamanthalawa", label: "Kolamanthalawa" },
        { value: "komana", label: "Komana" },
        { value: "marangala", label: "Marangala" },
        { value: "miriswatta", label: "Miriswatta" },
        { value: "moradeniya", label: "Moradeniya" },
        { value: "padiyathalawa", label: "Padiyathalawa" },
        { value: "palathuruwella", label: "Palathuruwella" },
        { value: "pallegama", label: "Pallegama" },
        { value: "pulungasmulla", label: "Pulungasmulla" },
        { value: "saranagama", label: "Saranagama" },
        { value: "serankada", label: "Serankada" },
        { value: "thalapitaoya_left", label: "Thalapitaoya Left" },
        { value: "thalapitaoya_south", label: "Thalapitaoya South" },
        { value: "unapana", label: "Unapana" },
    ];

    const employmentOptions = [
        "Agricultural",
        "Self-employment",
        "Trade",
        "Transportation",
        "Industrial",
        "Daily wage work",
        "Service",
        "Monthly Salary work",
        "Other",
    ];

    const samurdhiSubsidy = [
        { value: "4500", label: "4500" },
        { value: "3500", label: "3500" },
        { value: "1500", label: "1500" },
        { value: "420", label: "420" },
    ];

    const aswasumaCategory = [
        { value: "Poor", label: "Poor" },
        { value: "Severely Poor", label: "Severely Poor" },
        { value: "Transient", label: "Transient" },
        { value: "Vulnerable", label: "Vulnerable" },
    ]

    const typesOfProjects = [
        { value: "Vehicle Tinkering", label: "Vehicle Tinkering" },
        { value: "Bakery Production", label: "Bakery Production" },
        { value: "Banana Cultivation", label: "Banana Cultivation" },
        { value: "Honey Production", label: "Honey Production" },
        { value: "Betel Production", label: "Betel Production" },
        { value: "Bites Production", label: "Bites Production" },
        { value: "Brick Making", label: "Brick Making" },
        { value: "Cassava Cultivation", label: "Cassava Cultivation" },
        { value: "Dairy Farming", label: "Dairy Farming" },
        { value: "Dairy Products (Milk, Yogurt, Ghee, Cheese)", label: "Dairy Products (Milk, Yogurt, Ghee, Cheese)" },
        { value: "Dried Fish Production", label: "Dried Fish Production" },
        { value: "Broom & Coir Product Manufacturing", label: "Broom & Coir Product Manufacturing" },
        { value: "Mats and Mosquito Net Production", label: "Mats and Mosquito Net Production" },
        { value: "Goat Husbandry", label: "Goat Husbandry" },
        { value: "Cashew Farming", label: "Cashew Farming" },
        { value: "Guava Farming (Kilo Guava)", label: "Guava Farming (Kilo Guava)" },
        { value: "Freshwater Fisheries", label: "Freshwater Fisheries" },
        { value: "Mechanical Carpentry", label: "Mechanical Carpentry" },
        { value: "Drumstick Cultivation", label: "Drumstick Cultivation" },
        { value: "Mushroom Cultivation", label: "Mushroom Cultivation" },
        { value: "Papaya Cultivation", label: "Papaya Cultivation" },
        { value: "Passion Fruit Cultivation", label: "Passion Fruit Cultivation" },
        { value: "Pork Production", label: "Pork Production" },
        { value: "Pineapple Farming", label: "Pineapple Farming" },
        { value: "Poultry Farming (Layer)", label: "Poultry Farming (Layer)" },
        { value: "Poultry Farming (Meat)", label: "Poultry Farming (Meat)" },
        { value: "Shoe Production", label: "Shoe Production" },
        { value: "Snacks Production", label: "Snacks Production" },
        { value: "string Hopper/Hopper Making", label: "string Hopper/Hopper Making" },
        { value: "Confectionery Production", label: "Confectionery Production" },
        { value: "Other", label: "Other" },
    ]

    const jobFields = [
        { value: "Three-wheeler Repair", label: "Three-wheeler Repair" },
        { value: "AC Technician", label: "AC Technician" },
        { value: "Bakery Products", label: "Bakery Products" },
        { value: "Batik", label: "Batik" },
        { value: "Cosmetology", label: "Cosmetology" },
        { value: "Welding", label: "Welding" },
        { value: "Motor Mechanic", label: "Motor Mechanic" },
        { value: "Bicycle Repair", label: "Bicycle Repair" },
        { value: "Bites Production", label: "Bites Production" },
        { value: "Caretaker", label: "Caretaker" },
        { value: "Catering Service", label: "Catering Service" },
        { value: "Chef", label: "Chef" },
        { value: "Coconut Oil Production", label: "Coconut Oil Production" },
        { value: "Waste Collection (Plastic and Polythene, Bottles, Scrap Iron, Coconut Shells, Paper etc.)", label: "Waste Collection (Plastic and Polythene, Bottles, Scrap Iron, Coconut Shells, Paper etc.)" },
        { value: "Nursing Care", label: "Nursing Care" },
        { value: "Plumber", label: "Plumber" },
        { value: "Sales Assistant (e.g. Abans, Food City)", label: "Sales Assistant (e.g. Abans, Food City)" },
        { value: "Dressmaking", label: "Dressmaking" },
        { value: "Shoe Making", label: "Shoe Making" },
        { value: "Computer, CCTV and Solar Panel Installation and Services", label: "Computer, CCTV and Solar Panel Installation and Services" },
        { value: "Electrician", label: "Electrician" },
        { value: "Electrical Wiring", label: "Electrical Wiring" },
        { value: "Fishnet Weaving", label: "Fishnet Weaving" },
        { value: "Graphic Designer", label: "Graphic Designer" },
        { value: "Salons", label: "Salons" },
        { value: "Handicrafts", label: "Handicrafts" },
        { value: "Heavy Vehicle Driver", label: "Heavy Vehicle Driver" },
        { value: "Heavy Vehicle Repair", label: "Heavy Vehicle Repair" },
        { value: "Iron Work", label: "Iron Work" },
        { value: "Juki Machine Repair", label: "Juki Machine Repair" },
        { value: "Mobile Phone Repair", label: "Mobile Phone Repair" },
        { value: "Mason", label: "Mason" },
        { value: "Kithul related products (e.g. Kithul honey, and jaggery)", label: "Kithul related products (e.g. Kithul honey, and jaggery)" },
        { value: "Painting", label: "Painting" },
        { value: "Room attendant (hotel)", label: "Room attendant (hotel)" },
        { value: "Vehicle maintenance (e.g. cushioning/painting/repair)", label: "Vehicle maintenance (e.g. cushioning/painting/repair)" },
        { value: "Tour guides", label: "Tour guides" },
        { value: "Other", label: "Other" },
    ]

    const handleProjectRadioChange = (value: string) => {
        setSelectedValue(value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRadioChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name: string, value: string, isChecked: boolean) => {
        setFormData(prev => {
            const currentArray = prev[name as keyof typeof formData] as string[];
            return {
                ...prev,
                [name]: isChecked 
                    ? [...currentArray, value]
                    : currentArray.filter(item => item !== value)
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createSamurdhiFamily(formData);
            alert('Samurdhi family record created successfully!');
        } catch (error: any) {
            alert(error.message || 'Failed to submit form');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ComponentCard title="Family Development plan for Community Empowerment">
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <Label>District</Label>
                        <Input 
                            type="text" 
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>Divisional Secretariat Division</Label>
                        <div className="relative">
                            <Select
                                options={divisionalSecretariatDivisions}
                                placeholder="Select Option"
                                onChange={(value) => handleSelectChange('divisionalSecretariat', value)}
                                className="dark:bg-dark-900"
                                value={formData.divisionalSecretariat}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon/>
                            </span>
                        </div>
                    </div>

                    <div>
                        <Label>Samurdhi Bank</Label>
                        <div className="relative">
                            <Select
                                options={samurdhiBanks}
                                placeholder="Select Option"
                                onChange={(value) => handleSelectChange('samurdhiBank', value)}
                                className="dark:bg-dark-900"
                                value={formData.samurdhiBank}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon/>
                            </span>
                        </div>
                    </div>

                    <div>
                        <Label>Grama Nildhari Division</Label>
                        <div className="relative">
                            <Select
                                options={gramaNiladhariOptions}
                                placeholder="Select Option"
                                onChange={(value) => handleSelectChange('gramaNiladhariDivision', value)}
                                className="dark:bg-dark-900"
                                value={formData.gramaNiladhariDivision}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon/>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label>Are you a Samurdhi beneficiary?/ Aswasuma beneficiary?/low-income earner?</Label>
                        <Radio
                            id="radio1"
                            name="beneficiaryType"
                            value="Previous Samurdhi beneficiary /Low income earner"
                            checked={formData.beneficiaryType === "Previous Samurdhi beneficiary /Low income earner"}
                            onChange={() => handleRadioChange('beneficiaryType', "Previous Samurdhi beneficiary /Low income earner")}
                            label="Previous Samurdhi beneficiary /Low income earner"
                        />
                        <Radio
                            id="radio2"
                            name="beneficiaryType"
                            value="Aswasuma beneficiary"
                            checked={formData.beneficiaryType === "Aswasuma beneficiary"}
                            onChange={() => handleRadioChange('beneficiaryType', "Aswasuma beneficiary")}
                            label="Aswasuma beneficiary"
                        />
                    </div>

                    <div>
                        <Label>Aswasuma household number</Label>
                        <Input 
                            type="text" 
                            name="aswasumaHouseholdNo"
                            value={formData.aswasumaHouseholdNo}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>National Identity Card Number</Label>
                        <Input 
                            type="text" 
                            name="nic"
                            value={formData.nic}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>Name of the Beneficiary</Label>
                        <Input 
                            type="text" 
                            name="beneficiaryName"
                            value={formData.beneficiaryName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label>Gender</Label>
                        <Radio
                            id="gender-female"
                            name="gender"
                            value="Female"
                            checked={formData.gender === "Female"}
                            onChange={() => handleRadioChange('gender', "Female")}
                            label="Female"
                        />
                        <Radio
                            id="gender-male"
                            name="gender"
                            value="Male"
                            checked={formData.gender === "Male"}
                            onChange={() => handleRadioChange('gender', "Male")}
                            label="Male"
                        />
                    </div>

                    <div>
                        <Label>Address</Label>
                        <Input 
                            type="text" 
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>Phone Number</Label>
                        <Input 
                            type="text" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>Age of Project Owner</Label>
                        <Input 
                            type="number" 
                            name="projectOwnerAge"
                            value={formData.projectOwnerAge}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>No. of Household Members Aged 18–60</Label>
                        <Label>Female</Label>
                        <Input 
                            type="number" 
                            name="female18To60"
                            value={formData.female18To60}
                            onChange={handleInputChange}
                        />
                        <Label>Male</Label>
                        <Input 
                            type="number" 
                            name="male18To60"
                            value={formData.male18To60}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Current Employment</Label>
                        <div className="grid grid-cols-3 gap-4">
                            {employmentOptions.map((option, index) => (
                                <Radio
                                    key={index}
                                    id={`employment-${index}`}
                                    name="currentEmployment"
                                    value={option}
                                    checked={formData.currentEmployment === option}
                                    onChange={() => handleRadioChange('currentEmployment', option)}
                                    label={option}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label>Other Occupation (if any)</Label>
                        <Input 
                            type="text" 
                            name="otherOccupation"
                            value={formData.otherOccupation}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label>Samurdhi subsidy received</Label>
                        <div className="relative">
                            <Select
                                options={samurdhiSubsidy}
                                placeholder="Select Option"
                                onChange={(value) => handleSelectChange('samurdhiSubsidy', value)}
                                className="dark:bg-dark-900"
                                value={formData.samurdhiSubsidy}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon/>
                            </span>
                        </div>
                    </div>

                    <div>
                        <Label>Aswasuma category</Label>
                        <div className="relative">
                            <Select
                                options={aswasumaCategory}
                                placeholder="Select Option"
                                onChange={(value) => handleSelectChange('aswasumaCategory', value)}
                                className="dark:bg-dark-900"
                                value={formData.aswasumaCategory}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon/>
                            </span>
                        </div>
                    </div>

                    <div>
                        <Label>What is Empowerment Dimension</Label>    
                        <div className="flex gap-3 mt-3">
                            <Checkbox 
                                checked={formData.empowermentDimension === "Business Opportunities/Self-Employment"}
                                onChange={(checked) => handleRadioChange('empowermentDimension', "Business Opportunities/Self-Employment")}
                            />
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Business Opportunities/Self-Employment
                            </span>
                        </div>
                        <div className="flex gap-3 mt-3">
                            <Checkbox 
                                checked={formData.empowermentDimension === "Employment Facilitation"}
                                onChange={(checked) => handleRadioChange('empowermentDimension', "Employment Facilitation")}
                            />
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Employment Facilitation
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Types of Projects</Label>
                        <div className="grid grid-cols-3 gap-4">
                            {typesOfProjects.map((project, index) => (
                                <Radio
                                    key={index}
                                    id={`project-${index}`}
                                    name="projectType"
                                    value={project.value}
                                    checked={formData.projectType === project.value}
                                    onChange={() => handleRadioChange('projectType', project.value)}
                                    label={project.label}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label>Specify other projects</Label>
                        <Input 
                            type="text" 
                            name="otherProject"
                            value={formData.otherProject}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Resources Needed</Label>
                        <div className="flex flex-col gap-2">
                            {['Loan', 'Raw materials', 'Training', 'Equipment', 'Marketing help', 'Other'].map((resource, index) => (
                                <div key={index} className="flex gap-3">
                                    <Checkbox
                                        checked={formData.resourcesNeeded.includes(resource)}
                                        onChange={(checked) => handleCheckboxChange('resourcesNeeded', resource, checked)}
                                    />
                                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        {resource}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox 
                            checked={formData.monthlySaving}
                            onChange={(checked) => setFormData(prev => ({ ...prev, monthlySaving: checked }))}
                        />
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Monthly Saving
                        </span>
                    </div>

                    {formData.monthlySaving && (
                        <div>
                            <Label>Saving Amount</Label>
                            <Input 
                                type="number" 
                                name="savingAmount"
                                value={formData.savingAmount}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Health Information</Label>
                        <div className="flex flex-col gap-2">
                            {['Chronic illness', 'Disability', 'Elder care support', 'Child care support', 'Other'].map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <Checkbox
                                        checked={formData.healthInfo.includes(item)}
                                        onChange={(checked) => handleCheckboxChange('healthInfo', item, checked)}
                                    />
                                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Domestic Dynamics</Label>
                        <div className="flex flex-col gap-2">
                            {['Debt', 'School dropout', 'Single parent', 'Elderly dependents', 'Other'].map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <Checkbox
                                        checked={formData.domesticDynamics.includes(item)}
                                        onChange={(checked) => handleCheckboxChange('domesticDynamics', item, checked)}
                                    />
                                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Community Participation</Label>
                        <div className="flex flex-col gap-2">
                            {['Village Council', 'Social welfare committee', 'Religious organization', 'Sports club', 'Other'].map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <Checkbox
                                        checked={formData.communityParticipation.includes(item)}
                                        onChange={(checked) => handleCheckboxChange('communityParticipation', item, checked)}
                                    />
                                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Housing Services</Label>
                        <div className="flex flex-col gap-2">
                            {['Inadequate water supply', 'Leaking roof', 'No sanitation', 'Unstable structure', 'Other'].map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <Checkbox
                                        checked={formData.housingServices.includes(item)}
                                        onChange={(checked) => handleCheckboxChange('housingServices', item, checked)}
                                    />
                                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <Button 
                            size="sm" 
                            variant="primary" 
                            startIcon={<BoxIcon />}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Button 
                            size="md" 
                            variant="primary" 
                            startIcon={<BoxIcon />}
                            type="button"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </ComponentCard>
    )
}

export default SamurdhiFamillyForm
