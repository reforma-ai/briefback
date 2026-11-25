---
"@reforma/briefback": minor
---

Make tests written during implementation try to break the code. Test-first slices
now add hostile cases chosen from the contract, and every stage that writes tests
follows the testing guide. Tests that assert nothing or that depend on copy,
locale, or markup are rewritten or dropped, and review applies the same check.
