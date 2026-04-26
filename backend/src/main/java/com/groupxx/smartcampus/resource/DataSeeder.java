package com.groupxx.smartcampus.resource;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ResourceRepository resourceRepository;

    public DataSeeder(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public void run(String... args) {
        if (resourceRepository.count() == 0) {
            System.out.println("[DataSeeder] Seeding 10 sample resources...");
            resourceRepository.saveAll(buildSeedData());
            System.out.println("[DataSeeder] Done seeding resources.");
        } else {
            System.out.println("[DataSeeder] Resources already exist, skipping seed.");
        }
    }

    private List<Resource> buildSeedData() {
        // LAB 1 — Computer Lab A
        Resource lab1 = new Resource();
        lab1.setName("Computer Lab A");
        lab1.setType(ResourceType.LAB);
        lab1.setCapacity(40);
        lab1.setLocation("Block A, Room 101");
        lab1.setBuilding("Block A");
        lab1.setFloor(1);
        lab1.setStatus(ResourceStatus.ACTIVE);
        lab1.setDescription("Fully equipped computer lab with 40 workstations running Windows 11 and Linux dual boot. High-speed internet and printing facilities available.");
        lab1.setAmenities(Arrays.asList("Projector", "AC", "Whiteboard", "High-Speed Internet", "Printer"));
        lab1.setAvailabilityWindows(Arrays.asList(
                window("MONDAY", "08:00", "18:00"),
                window("TUESDAY", "08:00", "18:00"),
                window("WEDNESDAY", "08:00", "18:00"),
                window("THURSDAY", "08:00", "18:00"),
                window("FRIDAY", "08:00", "16:00")
        ));
        lab1.setCreatedBy("admin@campus.edu");

        // LAB 2 — Network Lab
        Resource lab2 = new Resource();
        lab2.setName("Network Lab");
        lab2.setType(ResourceType.LAB);
        lab2.setCapacity(24);
        lab2.setLocation("Block A, Room 105");
        lab2.setBuilding("Block A");
        lab2.setFloor(1);
        lab2.setStatus(ResourceStatus.ACTIVE);
        lab2.setDescription("Specialised networking lab equipped with Cisco routers, switches, and packet tracer workstations. Ideal for network engineering courses.");
        lab2.setAmenities(Arrays.asList("Cisco Equipment", "AC", "Whiteboard", "Projector"));
        lab2.setAvailabilityWindows(Arrays.asList(
                window("MONDAY", "09:00", "17:00"),
                window("WEDNESDAY", "09:00", "17:00"),
                window("FRIDAY", "09:00", "15:00")
        ));
        lab2.setCreatedBy("admin@campus.edu");

        // LAB 3 — Physics Lab
        Resource lab3 = new Resource();
        lab3.setName("Physics Lab");
        lab3.setType(ResourceType.LAB);
        lab3.setCapacity(30);
        lab3.setLocation("Science Block, Room 201");
        lab3.setBuilding("Science Block");
        lab3.setFloor(2);
        lab3.setStatus(ResourceStatus.UNDER_MAINTENANCE);
        lab3.setDescription("Advanced physics lab with optics, mechanics, and electronics experiment stations. Currently under maintenance for equipment upgrades.");
        lab3.setAmenities(Arrays.asList("Lab Equipment", "Fume Hood", "Safety Equipment", "AC"));
        lab3.setAvailabilityWindows(Arrays.asList(
                window("TUESDAY", "10:00", "16:00"),
                window("THURSDAY", "10:00", "16:00")
        ));
        lab3.setCreatedBy("admin@campus.edu");

        // LECTURE HALL 1 — Main Auditorium
        Resource hall1 = new Resource();
        hall1.setName("Main Auditorium");
        hall1.setType(ResourceType.LECTURE_HALL);
        hall1.setCapacity(300);
        hall1.setLocation("Main Building, Ground Floor");
        hall1.setBuilding("Main Building");
        hall1.setFloor(0);
        hall1.setStatus(ResourceStatus.ACTIVE);
        hall1.setDescription("Large auditorium suitable for university-wide events, seminars, and major lectures. Equipped with professional AV system and stage lighting.");
        hall1.setAmenities(Arrays.asList("Projector", "AC", "Sound System", "Stage Lighting", "Microphone", "Recording System"));
        hall1.setAvailabilityWindows(Arrays.asList(
                window("MONDAY", "08:00", "20:00"),
                window("TUESDAY", "08:00", "20:00"),
                window("WEDNESDAY", "08:00", "20:00"),
                window("THURSDAY", "08:00", "20:00"),
                window("FRIDAY", "08:00", "20:00"),
                window("SATURDAY", "09:00", "18:00")
        ));
        hall1.setCreatedBy("admin@campus.edu");

        // LECTURE HALL 2 — Lecture Hall B2
        Resource hall2 = new Resource();
        hall2.setName("Lecture Hall B2");
        hall2.setType(ResourceType.LECTURE_HALL);
        hall2.setCapacity(80);
        hall2.setLocation("Block B, Room 202");
        hall2.setBuilding("Block B");
        hall2.setFloor(2);
        hall2.setStatus(ResourceStatus.ACTIVE);
        hall2.setDescription("Standard lecture hall with tiered seating for 80 students. Equipped with digital whiteboard and dual projector system.");
        hall2.setAmenities(Arrays.asList("Projector", "AC", "Digital Whiteboard", "Microphone"));
        hall2.setAvailabilityWindows(Arrays.asList(
                window("MONDAY", "08:00", "18:00"),
                window("TUESDAY", "08:00", "18:00"),
                window("WEDNESDAY", "08:00", "18:00"),
                window("THURSDAY", "08:00", "18:00"),
                window("FRIDAY", "08:00", "16:00")
        ));
        hall2.setCreatedBy("admin@campus.edu");

        // MEETING ROOM 1 — Board Room 1
        Resource meeting1 = new Resource();
        meeting1.setName("Board Room 1");
        meeting1.setType(ResourceType.MEETING_ROOM);
        meeting1.setCapacity(20);
        meeting1.setLocation("Main Building, Floor 3");
        meeting1.setBuilding("Main Building");
        meeting1.setFloor(3);
        meeting1.setStatus(ResourceStatus.ACTIVE);
        meeting1.setDescription("Executive boardroom with conference table seating for 20. Equipped with video conferencing system for hybrid meetings.");
        meeting1.setAmenities(Arrays.asList("Video Conferencing", "AC", "Whiteboard", "TV Screen", "Coffee Machine"));
        meeting1.setAvailabilityWindows(Arrays.asList(
                window("MONDAY", "08:00", "18:00"),
                window("TUESDAY", "08:00", "18:00"),
                window("WEDNESDAY", "08:00", "18:00"),
                window("THURSDAY", "08:00", "18:00"),
                window("FRIDAY", "08:00", "17:00")
        ));
        meeting1.setCreatedBy("admin@campus.edu");

        // MEETING ROOM 2 — Staff Meeting Room
        Resource meeting2 = new Resource();
        meeting2.setName("Staff Meeting Room");
        meeting2.setType(ResourceType.MEETING_ROOM);
        meeting2.setCapacity(12);
        meeting2.setLocation("Block B, Room 101");
        meeting2.setBuilding("Block B");
        meeting2.setFloor(1);
        meeting2.setStatus(ResourceStatus.OUT_OF_SERVICE);
        meeting2.setDescription("Compact meeting room for department staff meetings. Currently out of service due to HVAC repairs.");
        meeting2.setAmenities(Arrays.asList("Whiteboard", "TV Screen", "Projector"));
        meeting2.setAvailabilityWindows(Arrays.asList(
                window("TUESDAY", "09:00", "17:00"),
                window("THURSDAY", "09:00", "17:00")
        ));
        meeting2.setCreatedBy("admin@campus.edu");

        // EQUIPMENT 1 — Projector Set A
        Resource equip1 = new Resource();
        equip1.setName("Projector Set A");
        equip1.setType(ResourceType.EQUIPMENT);
        equip1.setCapacity(null);
        equip1.setLocation("AV Store Room, Main Building");
        equip1.setBuilding("Main Building");
        equip1.setFloor(0);
        equip1.setStatus(ResourceStatus.ACTIVE);
        equip1.setDescription("Portable HD projector set including tripod screen, HDMI cables, remote pointer, and carry case. Suitable for indoor and outdoor use.");
        equip1.setAmenities(Arrays.asList("HD 1080p", "HDMI", "Wireless", "Carry Case", "Remote Pointer"));
        equip1.setAvailabilityWindows(Arrays.asList(
                window("MONDAY", "08:00", "20:00"),
                window("TUESDAY", "08:00", "20:00"),
                window("WEDNESDAY", "08:00", "20:00"),
                window("THURSDAY", "08:00", "20:00"),
                window("FRIDAY", "08:00", "20:00"),
                window("SATURDAY", "09:00", "18:00")
        ));
        equip1.setCreatedBy("admin@campus.edu");

        // EQUIPMENT 2 — HD Camera Kit
        Resource equip2 = new Resource();
        equip2.setName("HD Camera Kit");
        equip2.setType(ResourceType.EQUIPMENT);
        equip2.setCapacity(null);
        equip2.setLocation("Media Room, Block A");
        equip2.setBuilding("Block A");
        equip2.setFloor(2);
        equip2.setStatus(ResourceStatus.ACTIVE);
        equip2.setDescription("Professional HD camera kit with tripod, extra batteries, memory cards, and lighting equipment. Available for academic video productions.");
        equip2.setAmenities(Arrays.asList("4K Video", "Tripod", "Extra Batteries", "Memory Cards", "LED Lighting"));
        equip2.setAvailabilityWindows(Arrays.asList(
                window("MONDAY", "09:00", "17:00"),
                window("WEDNESDAY", "09:00", "17:00"),
                window("FRIDAY", "09:00", "17:00")
        ));
        equip2.setCreatedBy("admin@campus.edu");

        // EQUIPMENT 3 — Portable PA System
        Resource equip3 = new Resource();
        equip3.setName("Portable PA System");
        equip3.setType(ResourceType.EQUIPMENT);
        equip3.setCapacity(null);
        equip3.setLocation("Events Store, Science Block");
        equip3.setBuilding("Science Block");
        equip3.setFloor(0);
        equip3.setStatus(ResourceStatus.ACTIVE);
        equip3.setDescription("Portable public address system with two wireless microphones, speaker stands, and amplifier. Suitable for outdoor events up to 500 attendees.");
        equip3.setAmenities(Arrays.asList("Wireless Microphones", "Speaker Stands", "Amplifier", "Bluetooth", "Battery Backup"));
        equip3.setAvailabilityWindows(Arrays.asList(
                window("MONDAY", "08:00", "20:00"),
                window("TUESDAY", "08:00", "20:00"),
                window("WEDNESDAY", "08:00", "20:00"),
                window("THURSDAY", "08:00", "20:00"),
                window("FRIDAY", "08:00", "20:00"),
                window("SATURDAY", "08:00", "22:00"),
                window("SUNDAY", "08:00", "22:00")
        ));
        equip3.setCreatedBy("admin@campus.edu");

        return Arrays.asList(lab1, lab2, lab3, hall1, hall2, meeting1, meeting2, equip1, equip2, equip3);
    }

    private AvailabilityWindow window(String day, String start, String end) {
        AvailabilityWindow w = new AvailabilityWindow();
        w.setDayOfWeek(day);
        w.setStartTime(start);
        w.setEndTime(end);
        return w;
    }
}
