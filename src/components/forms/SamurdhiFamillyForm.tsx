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

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
    };

    const handleProjectRadioChange = (value: string) => {
        setSelectedValue(value);
    };

    return (
        <ComponentCard title="Family Development plan for Community Empowerment">
            <div className="space-y-6">
                <div>
                    <Label>District</Label>
                    <Input type="text" />
                </div>

                <div>
                    <Label>Divisional Secretariat Division</Label>
                    <div className="relative">
                        <Select
                            options={divisionalSecretariatDivisions}
                            placeholder="Select Option"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
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
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
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
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
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
                        name="group1"
                        value="Previous Samurdhi beneficiary /Low income earner"
                        checked={selectedValue === "Previous Samurdhi beneficiary /Low income earner"}
                        onChange={handleRadioChange}
                        label="Previous Samurdhi beneficiary /Low income earnerPrevious Samurdhi beneficiary /Low income earner"
                    />
                    <Radio
                        id="radio2"
                        name="group1"
                        value="Aswasuma beneficiary"
                        checked={selectedValue === "Aswasuma beneficiary"}
                        onChange={handleRadioChange}
                        label="Aswasuma beneficiary"
                    />
                </div>

                <div>
                    <Label>Aswasuma household number</Label>
                    <Input type="text" />
                </div>

                <div>
                    <Label>National Identity Card Number</Label>
                    <Input type="text" />
                </div>

                <div>
                    <Label>Name of the Beneficiary</Label>
                    <Input type="text" />
                </div>

                <div className="flex flex-col gap-4">
                    <Label>Gender</Label>
                    <Radio
                        id="radio1"
                        name="group1"
                        value="female"
                        checked={selectedValue === "female"}
                        onChange={handleRadioChange}
                        label="Female"
                    />
                    <Radio
                        id="radio2"
                        name="group1"
                        value="male"
                        checked={selectedValue === "male"}
                        onChange={handleRadioChange}
                        label="Male"
                    />
                </div>

                <div>
                    <Label>Address</Label>
                    <Input type="text" />
                </div>

                <div>
                    <Label>Age of Project Owner</Label>
                    <Input type="text" />
                </div>

                <div>
                    <Label>No. of Household Members Aged 18–60</Label>
                    <Label>Female</Label>
                    <Input type="text" />
                    <Label>Male</Label>
                    <Input type="text" />
                </div>

                <div className="space-y-2">
                    <Label>Current Employment</Label>
                    <div className="grid grid-cols-3 gap-4">
                        {employmentOptions.map((option, index) => (
                            <Radio
                                key={index}
                                id={`employment-${index}`}
                                name="employmentGroup"
                                value={option}
                                checked={selectedValue === option}
                                onChange={handleRadioChange}
                                label={option}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <Label>Samurdhi subsidy received</Label>
                    <div className="relative">
                        <Select
                            options={samurdhiSubsidy}
                            placeholder="Select Option"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
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
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon/>
                        </span>
                    </div>
                </div>

                <div>
                    <Label>What is Empowerment Dimension</Label>    
                    <div className="flex gap-3 mt-3">
                        <Checkbox checked={isChecked} onChange={setIsChecked} />
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Business Opportunities/Self-Employment
                        </span>
                    </div>
                    <div className="flex gap-3 mt-3">
                        <Checkbox checked={isChecked} onChange={setIsChecked} />
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
                                name="projectGroup"
                                value={project.value}
                                checked={selectedProjectValue === project.value}
                                onChange={handleProjectRadioChange}
                                label={project.label}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <Label>Specify other projects</Label>
                    <Input type="text" />
                </div>

                <div>
                    <Label>Name of the child to be trained/employed</Label>
                    <Input type="text" />
                </div>

                <div>
                    <Label>Age of the child to be trained/employed</Label>
                    <Input type="text" />
                </div>

                <div className="flex flex-col gap-4">
                    <Label>Gender of the child to be trained/employed</Label>
                    <Radio
                        id="radio1"
                        name="group1"
                        value="female"
                        checked={selectedValue === "female"}
                        onChange={handleRadioChange}
                        label="Female"
                    />
                    <Radio
                        id="radio2"
                        name="group1"
                        value="male"
                        checked={selectedValue === "male"}
                        onChange={handleRadioChange}
                        label="Male"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Job Field</Label>
                    <div className="grid grid-cols-3 gap-4">
                        {jobFields.map((jobs, index) => (
                        <Radio
                            key={index}
                            id={`job-${index}`}
                            name="jobGroup"
                            value={jobs.value}
                            checked={selectedProjectValue === jobs.value}
                            onChange={handleProjectRadioChange}
                            label={jobs.label}
                        />
                        ))}
                    </div>
                </div>

                <div>
                    <Label>Please specify Other employment fields</Label>
                    <Input type="text" />
                </div>

                <div className="flex items-center gap-5">
                    <Button size="sm" variant="primary" startIcon={<BoxIcon />}>
                        Submit
                    </Button>
                    <Button size="md" variant="primary" startIcon={<BoxIcon />}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ComponentCard>
    )
}

export default SamurdhiFamillyForm
