import { Link } from "@inertiajs/inertia-react";
import { Head } from "@inertiajs/react";
import goldTigerLogo from "../assets/pictures/goldTigerLogo.webp";
import trucks from "../assets/news/trucks.webp";
import postpic from "../assets/news/postpic.webp";
import tcapp from "../assets/news/tcapp.webp";
import device from "../assets/news/device.webp";
import earth from "../assets/news/earth.webp";
import safety from "..//assets/news/safety.webp";
import track from "../assets/news/track.webp";
import newSite from "../assets/news/newSite.webp"
import { useState, useRef, useEffect } from "react";
import worker from "../assets/news/worker.webp";
import goldt from "../assets/news/goldt.webp";
import movers from "../assets/news/3movers.webp";
import { useParams } from "react-router-dom";
import React from "react";
import { usePage } from "@inertiajs/react";
import { InstagramIcon } from "react-social-icons";
import jobs from "../assets/pictures/jobs.webp";
import { Dialog } from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
    ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    LinkedinIcon,
    LinkedinShareButton,
    WhatsappShareButton,
    WhatsappIcon,
} from "react-share";
import Footer from "./Component/landingPage/Footer";
import SecondaryFooter from "./Component/landingPage/SecondaryFooter";
import Navbars from "./Component/navbars";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const navigation = [
    { name: "Services", href: "/#services", ref: "services" },
    { name: "About", href: "/#about", ref: "about" },
    { name: "News", href: "/#news", ref: "news" },
    { name: "Contact Us", href: "/#contact", ref: "contact" },
];

const handleClick = () => {
    history.push("/", { scrollToElement: "news" });
};

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        >
            {/* <ArrowSmallRightIcon/> */}
        </div>
    );
}

export default function NewsPage(props) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };
    const maxScrollWidth = useRef(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carousel = useRef(null);

    const movePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevState) => prevState - 1);
        }
    };

    const moveNext = () => {
        if (
            carousel.current !== null &&
            carousel.current.offsetWidth * currentIndex <=
                maxScrollWidth.current
        ) {
            setCurrentIndex((prevState) => prevState + 1);
        }
    };

    const isDisabled = (direction) => {
        if (direction === "prev") {
            return currentIndex <= 0;
        }

        if (direction === "next" && carousel.current !== null) {
            return (
                carousel.current.offsetWidth * currentIndex >=
                maxScrollWidth.current
            );
        }

        return false;
    };

    useEffect(() => {
        if (carousel !== null && carousel.current !== null) {
            carousel.current.scrollLeft =
                carousel.current.offsetWidth * currentIndex;
        }
    }, [currentIndex]);

    useEffect(() => {
        maxScrollWidth.current = carousel.current
            ? carousel.current.scrollWidth - carousel.current.offsetWidth
            : 0;
    }, []);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const { id } = usePage().props;

    const handleFileUpload = (file) => {
        setResumeFile(file);
        setResumePreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        let prevScrollPosition = window.pageYOffset;

        function handleScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            setShowNavbar(scrollTop > 0);
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const contentJson = [
        {
            id: 0,

            title: "FLEET BOOSTED BY 25 VOLVO EURO 6 PRIME MOVERS",
            content1:
                "Gold Tiger Logistic Solutions has added 25 new prime movers and trailers to its transport fleet, taking the total to more than 80 prime movers, 150 trailers and 35 delivery trucks based out of its Sydney headquarters.",

            content2:
                "The 600HP, Swedish-built prime movers will considerably increase Gold Tiger’s interstate line haul capacity, particularly on the Sydney–Brisbane and Sydney–Melbourne routes, as well as longer national hauls. The emissions profile of Volvo’s Euro 6 truck engine is a big improvement on the Euro 5, meeting tougher European standards rather than current Australian standards. Among other features, a Euro 6 engine has only one-fifth the nitrogen oxide emissions and half the particulate emissions of a Euro 5 engine. It also has greater fuel efficiency. The Euro 6 truck purchase is part of Gold Tiger’s commitment to running a modern transport fleet that reduces its impact on the environment. It is also part of a major business expansion underway at Gold Tiger (see next story). Gold Tiger’s all-Volvo prime mover fleet is backed by Volvo’s Gold maintenance program, which includes a regular maintenance schedule to the highest manufacturer standards, 24-hour breakdown repair around Australia, and replacement vehicles if trucks need to be off the road for more than 24 hours. This is backed up by weekly checks and servicing by qualified mechanics in our own on-site workshops.",

            imgUrl: postpic,
        },

        {
            id: 1,
            title: "GOLD TIGER IN $100M BUSINESS EXPANSION",
            content1:
                "Purpose-built transport hubs in Sydney and Brisbane are part of a $100-million business expansion now underway at Gold Tiger Logistic Solutions.",

            content2:
                'In Sydney, Gold Tiger has purchased land in the west at Kemps Creek, just off the M7 Motorway and next door to Badgerys Creek, where Sydney’s second airport is now under construction. Gold Tiger will build a 35,000sqm transport and warehousing facility as its new national headquarters. It is expected to open early in 2024. The new hub will have the latest warehousing and logistics technology, lots of space for quick truck turnarounds, ample storage space and a full on-site mechanics’ workshop for day-to-day truck servicing. The new building will also be 100% powered by its own solar energy system. Gold Tiger’s current fully owned transport and warehousing headquarters in Ingleburn, about 25 kilometres from the new site, will continue to operate, meaning the new facility will provide a huge boost to Gold Tiger’s capabilities and capacities.\n \n In Brisbane, Gold Tiger has purchased  land at Crestmead, south of Brisbane in the City of Logan, with easy access to the Logan Motorway. The company will build a 15,000sqm transport and warehousing hub, which will replace a smaller rented facility in Richlands.The Brisbane hub will be a similar but scaled down version of the Sydney hub, including a solar energy system to meet all its electrical needs. The Brisbane hub is planned to open by the end of 2023.',

            imgUrl: trucks,
        },

        {
            id: 2,
            title: "TC8300 Touch Computer implementation",
            content1:
                "Gold Tiger Logistics Solutions, an Australian logistics company, revolutionised their business three years ago by implementing a cutting-edge product scanning system.",

            content2:
                "With the product scanning system, Gold Tiger Logistics Solutions is able to track the movement of goods throughout the supply chain, from the moment they enter their facilities until they reach their final destination. The system provides real-time updates on the location and condition of each product, allowing the company to make timely decisions and adjustments to their processes. Since implementing the product scanning system, Gold Tiger Logistics Solutions has experienced significant growth in their business. The company has expanded their customer base and increased growth, thanks to the reliable and efficient services they are able to provide. “Product scanning has truly transformed the way we do business,” says Craig Dunscombe, CEO of Gold Tiger Logistics Solutions. “We are now able to provide our customers with unparalleled visibility into their supply chain, and this has been a game-changer for us.” Gold Tiger Logistics Solutions’ success story is a testament to the transformative power of technology in the logistics industry. As businesses continue to face increasing pressure to deliver goods faster and more efficiently, product scanning systems will undoubtedly become a crucial tool in their arsenal.",

            imgUrl: tcapp,
        },
        {
            id: 3,
            title: "VEHICLE TRACKING",
            content1:
                "Gold Tiger Logistics Solutions, a company in the transportation and logistics industry, has recently adopted three cutting-edge technologies to improve its operations.",

            content2:
                "Firstly, the VT102 AI-enabled fleet management solution provides real-time data on vehicle performance, driver behaviour, and safety-related incidents. This enables Gold Tiger Logistics Solutions to make informed decisions on vehicle deployment and maintenance, improve operational efficiency, and ensure compliance with safety regulations. Secondly, the MT201 in-cabin device is a ruggedized tablet that helps drivers maintain compliance, particularly in areas such as fatigue, speed, and maintenance. The tablet provides easy access to a wide range of applications, including Sentinel, a true EWD Electronic Work Diary, IAP, pre-trip checklists, customisable forms, document management, mass management, real-time fatigue alerts, messaging, job dispatch, and turn-by-turn navigation. Lastly, the Qtanium 200 4G tracking device is a self-contained, weatherproof tracking device that features a rechargeable battery pack, making it ideal for managing assets that are normally tethered to 12 or 24-volt systems but may sit disconnected for periods. It provides real-time tracking and reporting of the fleet’s location and status, and can detect motion, harsh usage, and impact, making it an ideal solution for tracking trailers. By adopting these technologies, Gold Tiger Logistics Solutions can optimize routes, reduce downtime, improve safety, and enhance its logistics and transportation services.",

            imgUrl: track,
        },
        {
            id: 4,
            title: "DRIVER PDA’S",
            content1:
                "Gold Tiger Logistics Solution, a prominent logistics company, is making waves with its purchase of product – Zebra TX57 PDA’s.",

            content2:
                "The company’s purchase has revolutionized the way their deliveries are tracked. TX57 is a state-of-the-art technology that enables customers to sign on glass proof of delivery (POD) electronically, eliminating the need for paper-based delivery receipts. This feature allows for seamless tracking and verification of deliveries, reducing the likelihood of delivery disputes. According to Gold Tiger Logistics Solution’s CEO, the TX57 product has been well-received by customers and is quickly gaining popularity in the logistics industry. The company streamlined delivery processes and improves overall customer satisfaction. “We understand the importance of providing our customers with the best possible experience, which is why we introduced TX57,” said the CEO. “Our innovative product is just one example of how we’re constantly looking for ways to improve our services and exceed customer expectations.” Gold Tiger Logistics Solution’s commitment to innovation and customer satisfaction has earned them a reputation as a leader in the logistics industry. With the introduction of TX57, the company continues to set the standard for excellence in delivery servi",

            imgUrl: device,
        },
        {
            id: 5,
            title: "GTLS EXPANSION",
            content1:
                "As part of the GTLS expansion a greenfield site has been purchased within the Ingleburn Industrial Estate. This is stage 1 in a major investment and development program for the company.",

            content2:
                "This will be ultimately be transformed into a state-of-the-art Transport and Warehouse facility as well as a modern service centre to maintain the Gold Tiger Fleet. With the increasing demand for high speed and efficient handling of freight supported by the latest in IT and communications systems this facility will be an essential part of Gold Tiger’s growth and development into the next decade.",

            imgUrl: goldt,
        },
        {
            id: 6,
            title: "GOLD TIGER LOGISTICS SOLUTIONS COMPLETES FIBRE INTERNET UPGRADE ACROSS ALL SITES",
            content1:
                "Gold Tiger Logistics Solutions has announced the completion of its internet upgrade, bringing fibre internet to all of its sites.",

            content2:
                "The upgrade is expected to boost connectivity and speed, potentially improving the company’s operations and customer service. The company has invested in upgrading its internet infrastructure to fibre technology, providing faster and more reliable connectivity to its sites. The upgrade is expected to enhance the company’s communication and data transfer capabilities, which could lead to increased productivity and efficiency. “We are thrilled to have completed this important upgrade to our internet infrastructure,” said a company spokesperson. “With fibre internet, we can ensure that our sites are connected at lightning-fast speeds, allowing us to deliver top-notch services to our customers.” The company has not disclosed the total cost of the upgrade, but it is expected to be a significant investment in the company’s infrastructure. Gold Tiger Logistics Solutions is a logistics company that specializes in transportation, warehousing, and distribution services. The company operates in multiple locations across the country and serves a variety of industries.",

            imgUrl: earth,
        },
        {
            id: 7,
            title: "GOLD TIGER LOGISTICS SOLUTIONS ADOPTS STATE-OF-THE-ART SOFTWARE TO ENHANCE STAFF SAFETY AND COMPLIANCE",
            content1:
                "Gold Tiger Logistics Solutions, a leading logistics and transportation company, has announced the adoption of a new cloud-based software platform to enhance staff safety and compliance.",

            content2:
                "The platform, developed by SkyTrust, will help the company manage safety and compliance issues, such as incident management, risk assessments, safety audits, and compliance reporting. According to Craig Dunscombe, a spokesperson for Gold Tiger Logistics Solutions, the adoption of the new software is part of the company’s commitment to ensuring the safety of its employees and customers. “As a logistics company, safety is our top priority,” he said. “We are always looking for ways to improve our safety performance and reduce the risk of incidents and accidents.” The SkyTrust software platform offers a range of safety and compliance management solutions, including tools for identifying potential hazards, assessing risks, and implementing effective control measures. It also provides features for managing safety incidents, such as near-misses and accidents, by facilitating the reporting, investigation, and analysis of incidents. Additionally, the platform offers compliance management tools to help companies comply with industry regulations and standards. “We chose the SkyTrust platform because it is the most comprehensive and user-friendly solution on the market,” Dunscombe added. “It will help us streamline our safety and compliance processes, improve our reporting capabilities, and ultimately enhance the safety of our staff and customers.” The adoption of the SkyTrust software platform is part of Gold Tiger Logistics Solutions’ ongoing efforts to enhance its safety performance and maintain its reputation as a leading logistics provider. With the new platform in place, the company is well-positioned to continue its growth and expansion while ensuring the highest levels of safety and compliance. About Gold Tiger Logistics Solutions Gold Tiger Logistics Solutions is a leading Australian logistics and transportation company that provides a wide range of services, including freight forwarding, and warehousing. With a focus on safety, efficiency, and customer service, the company has established itself as a trusted partner for businesses of all sizes.",

            imgUrl: safety,
        },
        {
            id: 8,
            title: "GOLD TIGER LOGISTICS SOLUTION IMPLEMENTS GEARBOX WORKSHOP SOFTWARE FOR STREAMLINED MAINTENANCE",
            content1:
                "Gold Tiger Logistics Solutions and their group of companies are making strides towards expanding their operations with several exciting developments underway.",

            content2:
                "The software, which was implemented 12 months ago, is already proving to be a valuable tool for the company’s maintenance team. According to Craig Dunscombe, a spokesman for Gold Tiger Logistics Solution, the decision to implement Gearbox was driven by a need to streamline their maintenance operations and improve efficiency. “We were looking for a software solution that could help us manage our maintenance operations more effectively, and Gearbox was the clear choice,” said Mr. Dunscombe. Gearbox workshop software provides a comprehensive solution for automotive repair businesses, with features such as appointment scheduling, inventory management, and transport management. Gold Tiger Logistics Solution will be using the software primarily for maintenance operations, including scheduling preventative maintenance and tracking repairs. The software has already had a significant impact on the company’s maintenance operations, with Mr. Dunscombe reporting that they have seen improvements in efficiency and communication. “With Gearbox, we’re able to track our maintenance operations more effectively, and we’re also able to communicate more easily with our maintenance team and Operations,” he said. Gold Tiger Logistics Solution is committed to investing in technology solutions that help them stay ahead of the curve in the logistics industry. The implementation of Gearbox workshop software is just one example of their commitment to innovation and excellence. With the success of the Gearbox implementation, Gold Tiger Logistics Solution is now exploring other technology solutions that can help them improve their operations and better serve their customers.",

            imgUrl: worker,
        },
        {
            id: 9,
            title: "GOLD TIGER LOGISTICS SOLUTIONS: UNVEILING EXCITING DEVELOPMENTS AND EXPANDING OPERATIONS",
            content1:
                "Gold Tiger Logistics Solution, a leading logistics and transportation company, has recently implemented Gearbox workshop software to manage their maintenance operations.",

            content2:
                "Firstly, the company has submitted a Development Application (DA) for their new Ingleburn site.This formal request for approval is a crucial step towards the realization of this project. Gold Tiger Logistics Solutions aims to build a state-of-the-art workshop at the site, which will be able to accommodate general and major repairs if they ever arise. Similarly, the company has also submitted a DA for their new Brisbane site, indicating their commitment to expanding their reach and providing efficient services to their clients. Gold Tiger Logistics Solutions is also actively encouraging overseas heavy vehicle mechanics to be sponsored. The company is committed to investing in and attracting top talent from around the world, which will help to bolster the quality of their services. In addition to these developments, Gold Tiger Logistics Solutions has also expanded its overseas support team. The company has hired professionals in Customer Support, Accounts, and IT (programmers and developers) to ensure that they can provide world-class services to their clients. According to Craig Dunscombe, the company’s spokesman, Gold Tiger Logistics Solutions has invested over 1 million dollars in development costs over the past 12 months. This significant investment underscores the company’s commitment to growth and development. Gold Tiger Logistics Solutions is a leading logistics company that has established a strong reputation for providing reliable and efficient services to their clients. With these exciting developments underway, the company is well-positioned to continue to provide top-quality services to their clients while expanding their reach and operations.",
            imgUrl: newSite,
        },
        {
            id: 10,
            title: "GOLD TIGER LOGISTICS SOLUTIONS CONTINUES ADVANCEMENT WITH THREE NEW VOLVO F16 PRIME MOVERS",
            content1:
                "Gold Tiger Logistics Solutions has, this week taken delivery of three new Volvo F16 (Euro 6) prime movers as part of its continuing commitment to constantly modernising and upgrading the fleet. Gold Tiger has used Volvo equipment since the company was formed in 2006 and the partnership has gone from strength to strength over the years.",

            content2:
                "The Volvo F16 incorporates the latest in Volvo technology with the latest D16 engine with up to 650 hp for Euro 6. The D16 engines are more efficient than ever – maximising the fuel efficiency of the vehicle while minimising emissions. The new Volvo vehicles incorporate Volvo’s Dynamic Steering System which enables the vehicle to maintain directional control and total stability even in the event of a high wind event – a perennial problem in the past with long distance trucks and causing abrupt and unexpected lane changes on interstate highways. The Dynamic Steering System also helps avoid skidding with its active steering/suspension management control function. Gold Tiger Logistics Solutions maintains a Gold Level Service Contract with Volvo Australia. This means that thanks to the vehicle’s built-in connectivity technology, Volvo can plan workshop visits according to driven mileage and the wear and tear of key components. Potential issues can be avoided before they occur. We will not be sitting on our laurels, however. This is all part of the Gold Tiger program to continue carrying the company forward by utilising the most modern and efficient technology available and thus continuing to be at the cutting edge of service provision to our customers.",
            imgUrl: movers,
        },
    ];

    const posts = [
        {
            id: 0,
            title: "Fleet boosted by 25 Volvo Euro 6 prime movers",
            href: "#",
            description:
                "Gold Tiger Logistic Solutions has added 25 new prime movers and trailers to its transport fleet, taking the total to",
            imageUrl: postpic,
            date: "October 31, 2022",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 1,
            title: "Gold Tiger in $100m business expansion",
            href: "#",
            description:
                "Purpose-built transport hubs in Sydney and Brisbane are part of a $100-million business expansion now underway at Gold Tiger Logistic",
            imageUrl: trucks,
            date: "October 13, 2022",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 2,
            title: "TC8300 Touch Computer implementation",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions, an Australian logistics company, revolutionised their business three years ago by implementing a cutting-edge product scanning system.",
            imageUrl: tcapp,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 3,
            title: "Vehicle Tracking",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions, a company in the transportation and logistics industry, has recently adopted three cutting-edge technologies to improve its operations. Firstly, the VT102",
            imageUrl: track,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 4,
            title: "Driver PDA’s",
            href: "#",
            description:
                "Gold Tiger Logistics Solution, a prominent logistics company, is making waves with its purchase of product – Zebra TX57 PDA’s. The company’s purchase has revolutionized",
            imageUrl: device,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 5,
            title: "GTLS Expansion",
            href: "#",
            description:
                "As part of the GTLS expansion a greenfield site has been purchased within the Ingleburn Industrial Estate. This is stage 1 in a major investment",
            imageUrl: goldt,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 6,
            title: "Gold Tiger Logistics Solutions completes Fibre internet upgrade across all sites",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions has announced the completion of its internet upgrade, bringing fibre internet to all of its sites. The upgrade is expected to",
            imageUrl: earth,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 7,
            title: "Gold Tiger Logistics Solutions Adopts State-of-the-Art Software to Enhance Staff Safety and Compliance",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions, a leading logistics and transportation company, has announced the adoption of a new cloud-based software platform to enhance staff safety and",
            imageUrl: safety,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 8,
            title: "Gold Tiger Logistics Solution Implements Gearbox Workshop Software for Streamlined Maintenance",
            href: "#",
            description:
                "Gold Tiger Logistics Solution, a leading logistics and transportation company, has recently implemented Gearbox workshop software to manage their maintenance operations. The software, which was",
            imageUrl: worker,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 9,
            title: "Gold Tiger Logistics Solutions: Unveiling exciting developments and expanding operations",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions and their group of companies are making strides towards expanding their operations with several exciting developments underway.",
            imageUrl: newSite,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 10,
            title: "Gold Tiger Logistics Solutions Continues advancement with three new volvo F16 prime movers",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions has, this week taken delivery of three new Volvo F16 (Euro 6) prime movers as part of its continuing commitment to constantly modernising and upgrading the fleet. Gold Tiger has used Volvo equipment since the company was formed in 2006 and the partnership has gone from strength to strength over the years.",
            imageUrl: movers,
            date: "June 2, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
    
        // More posts...
    ];

    const filteredData = posts.filter((item) => item.id != id);

    const pageUrl = window.location.href;

    return (
        <>
            <Head title="News" />
            <div className="relative isolate bg-dark">
                <Navbars />
                {/* <HeroSection/> */}

                <div aria-hidden="true" className="relative">
                    <img
                        src={contentJson[id].imgUrl}
                        alt="news"
                        className="h-96 w-full object-cover  "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                </div>

                <div className="bg-dark pb-10 px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                        {/* <p className="text-base font-semibold leading-7 text-indigo-600">
                            Introducing
                        </p> */}
                        {/* {contentJson.map((post) => ( */}
                        <a
                            href="/#news"
                            className="relative inline-flex items-center justify-center text-black "
                        >
                            <ArrowLongLeftIcon className="h-5 text-goldt " />
                            <span className="p-1 text-white">Back to main</span>
                        </a>
                        <div key={contentJson[id].id}>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                                {contentJson[id].title}
                            </h1>
                            <p className="mt-6 text-xl leading-8 text-gray-200">
                                {contentJson[id].content1}
                            </p>
                            <div className="mt-10 text-lg max-w-2xl text-gray-300">
                                <p style={{ whiteSpace: 'pre-line' }}>{contentJson[id].content2}</p>
                            </div>
                            <figure className="mt-16">
                                <img
                                    className="aspect-video rounded-xl bg-gray-50 object-cover"
                                    src={contentJson[id].imgUrl}
                                    alt={contentJson[id].title}
                                />
                            </figure>
                            <div className="mt-10">
                                <p className="mt-2 mb-5 text-xl font-bold tracking-tight text-white sm:text-xl">
                                    Share to your friends
                                </p>
                                <FacebookShareButton
                                    url={pageUrl}
                                    title={contentJson[id].title}
                                >
                                    <FacebookIcon className="rounded-md h-10 w-auto mr-3" />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    url={pageUrl}
                                    title={contentJson[id].title}
                                >
                                    <TwitterIcon className="rounded-md h-10 w-auto mr-3" />
                                </TwitterShareButton>
                                <LinkedinShareButton
                                    url={pageUrl}
                                    title={contentJson[id].title}
                                >
                                    <LinkedinIcon className="rounded-md h-10 w-auto mr-3" />
                                </LinkedinShareButton>
                                <WhatsappShareButton
                                    url={pageUrl}
                                    title={contentJson[id].title}
                                >
                                    <WhatsappIcon className="rounded-md h-10 w-auto mr-3" />
                                </WhatsappShareButton>
                            </div>
                        </div>
                        {/* ))} */}
                    </div>
                </div>
                <div className="bg-dark py-24 px-1 sm:py-10 mb-5" id="news">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                                More News
                            </h2>
                        </div>
                        <Slider {...settings}>
                            {posts.map((post) => (
                                <div key={post.id} className="px-5 ">
                                    <Link
                                        href={route("news", { id: post.id })}
                                        className=""
                                    >
                                        <div className="h-full">
                                            <div className="relative w-full www">
                                                <img
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    className="aspect-[16/9] rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[5/2] w-full "
                                                />
                                                <div className="absolute rounded-2xl inset-0 bg-gradient-to-b from-transparent to-goldt opacity-40"></div>
                                            </div>
                                            <article
                                                key={post.id}
                                                className="flex flex-col items-start justify-between border border-yellow-200 border-opacity-20 rounded-2xl h-72"
                                            >
                                                <div className="max-w-xl mx-4 mb-6  mt-12">
                                                    <div className="mt-5 flex items-center gap-x-4 text-xs">
                                                        <time
                                                            dateTime={
                                                                post.datetime
                                                            }
                                                            className="text-goldl font-bold"
                                                        >
                                                            {post.date}
                                                        </time>
                                                    </div>
                                                    <div className="group relative">
                                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-600 font-bold">
                                                            <span className="absolute inset-0" />
                                                            {post.title}
                                                        </h3>
                                                        <p className="mt-5 text-sm leading-6 text-gray-400 line-clamp-3">
                                                            {post.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
