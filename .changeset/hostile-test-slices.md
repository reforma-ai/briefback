---
"@reforma/briefback": minor
---

Make tests written during implementation try to break the code. Test-first slices
now add hostile cases chosen from the contract, and every stage that writes tests
follows the testing guide. Tests that assert nothing, depend on copy, locale, or
markup, or repeat what another test already catches are rewritten, merged, or
dropped, and review applies the same check.
