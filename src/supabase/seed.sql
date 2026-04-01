-- Seed test school
INSERT INTO schools (name, slug, email, phone, status) VALUES 
('Test School Sudan', 'test-school', 'info@testschool.edu', '+249123456789', 'active');

-- Seed classes
INSERT INTO classes (school_id, name, grade_level, academic_year, capacity) VALUES
((SELECT id FROM schools WHERE slug='test-school'), 'Grade 1A', 1, '2024', 30),
((SELECT id FROM schools WHERE slug='test-school'), 'Grade 1B', 1, '2024', 30),
((SELECT id FROM schools WHERE slug='test-school'), 'Grade 2A', 2, '2024', 30);

-- Seed students
INSERT INTO students (school_id, student_number, full_name, class_id, enrollment_date) VALUES
((SELECT id FROM schools WHERE slug='test-school'), 'STU-2024-000001', 'Ahmed Mohammed', (SELECT id FROM classes WHERE name='Grade 1A'), '2024-01-15'),
((SELECT id FROM schools WHERE slug='test-school'), 'STU-2024-000002', 'Fatima Ibrahim', (SELECT id FROM classes WHERE name='Grade 1A'), '2024-01-15');

-- Seed test leads
INSERT INTO leads (school_id, full_name, phone, student_name, status) VALUES
((SELECT id FROM schools WHERE slug='test-school'), 'Omar Hassan', '+249112233445', 'Sara Omar', 'new'),
((SELECT id FROM schools WHERE slug='test-school'), 'Nadia Ali', '+249998877665', 'Khalid Ali', 'contacted');