# Plan: Image Generator Skill Integration in PAI

## Zusammenfassung

Integration des `image-generator-bananapro` Skills in PAI als separater, komplementärer Skill zum existierenden `art` Skill.

**Entscheidung:** Beide Skills behalten - sie dienen unterschiedlichen Zwecken.

## User-Entscheidungen

| Frage | Antwort |
|-------|---------|
| CLI-Sprache | **TypeScript (Bun)** - konsistent mit PAI-Stack |
| art-Skill Fix | **Ja, gleichzeitig** - beide Skills kanonisieren |
| Neuer Skill-Name | **ImageGeneratorNanoBananaPro** |

---

## Analyse

### Existierender `art` Skill
- **Pfad:** `~/.claude/skills/art/`
- **Zweck:** Künstlerische/Editorial Bilder mit spezifischer Ästhetik
- **Stärke:** Funktionierendes CLI-Tool, Multi-Model-Support
- **PAI-Compliance:** Teilweise (lowercase Naming, YAML-Probleme)

### Neuer `image-generator-bananapro` Skill
- **Quelle:** `/Users/pretor/Documents/GitHub/Weihnachtszeitung/image-generator-bananapro.skill`
- **Zweck:** Business-Visuals (Diagramme, Dashboards, Infografiken)
- **Stärke:** Umfangreiche Prompt-Library für 11 Business-Domains
- **Schwäche:** Kein CLI-Tool, nur Dokumentation

---

## Implementierungsplan

### Phase 1: Neuen Skill erstellen (ImageGeneratorNanoBananaPro)

1. **Verzeichnis erstellen:**
   ```
   ~/.claude/skills/ImageGeneratorNanoBananaPro/
   ├── SKILL.md              # PAI-konformes YAML
   ├── workflows/
   │   ├── Generate.md       # Haupt-Workflow
   │   ├── Diagram.md        # Architektur/Flow-Diagramme
   │   ├── Dashboard.md      # KPI/BI Dashboards
   │   └── Infographic.md    # Infografiken
   ├── references/
   │   ├── PromptLibrary.md  # Domain-spezifische Templates
   │   ├── PromptingGuide.md # 6 Prompting-Prinzipien
   │   ├── ApiReference.md   # API-Dokumentation
   │   ├── Limitations.md    # Was das Modell nicht kann
   │   └── SevenEngines.md   # Model-Architektur
   └── tools/
       └── GenerateImage.ts  # CLI-Tool (TypeScript/Bun)
   ```

2. **SKILL.md (PAI-konform):**
   ```yaml
   ---
   name: ImageGeneratorNanoBananaPro
   description: Generate professional business visuals using Nano Banana Pro. USE WHEN user wants diagrams, dashboards, infographics, architecture visualizations, flowcharts, org charts, or data visualizations OR user says "create diagram", "visualize this", "make infographic".
   ---
   ```

3. **CLI-Tool erstellen:**
   - Basis: Existierendes `generate-ulart-image.ts` anpassen
   - Entfernen: UL-Branding, spezifische Ästhetik
   - Hinzufügen: Structured Prompt Support (TASK/STYLE/LAYOUT/etc.)
   - Behalten: Multi-Model-Support, Aspect-Ratios, Output-Optionen

### Phase 2: Reference-Dateien migrieren

Aus dem Original-Skill übernehmen (mit TitleCase-Umbenennung):
- `prompt_library.md` → `PromptLibrary.md`
- `prompting_guide.md` → `PromptingGuide.md`
- `api_reference.md` → `ApiReference.md`
- `limitations.md` → `Limitations.md`
- `seven_engines.md` → `SevenEngines.md`

### Phase 3: Existierenden `art` Skill kanonisieren

**Gleichzeitig mit Phase 1+2 durchführen:**

1. **Verzeichnis umbenennen:**
   - `~/.claude/skills/art/` → `~/.claude/skills/Art/`

2. **SKILL.md korrigieren:**
   - Multi-line YAML `|` → Single-line description
   - Separaten `triggers:` Block entfernen
   - Separaten `workflows:` Block entfernen
   - USE WHEN in description integrieren

3. **Workflow-Dateien umbenennen (TitleCase):**
   ```
   workflow.md → Workflow.md
   visualize.md → Visualize.md
   mermaid.md → Mermaid.md
   technical-diagrams.md → TechnicalDiagrams.md
   taxonomies.md → Taxonomies.md
   timelines.md → Timelines.md
   frameworks.md → Frameworks.md
   comparisons.md → Comparisons.md
   annotated-screenshots.md → AnnotatedScreenshots.md
   recipe-cards.md → RecipeCards.md
   aphorisms.md → Aphorisms.md
   maps.md → Maps.md
   stats.md → Stats.md
   comics.md → Comics.md
   ```

4. **Tool-Datei umbenennen:**
   - `generate-ulart-image.ts` → `GenerateImage.ts`
   - Interne Referenzen anpassen

---

## Dateien zu erstellen/modifizieren

### Neuer Skill: ImageGeneratorNanoBananaPro

| Aktion | Datei |
|--------|-------|
| CREATE | `~/.claude/skills/ImageGeneratorNanoBananaPro/SKILL.md` |
| CREATE | `~/.claude/skills/ImageGeneratorNanoBananaPro/workflows/Generate.md` |
| CREATE | `~/.claude/skills/ImageGeneratorNanoBananaPro/workflows/Diagram.md` |
| CREATE | `~/.claude/skills/ImageGeneratorNanoBananaPro/workflows/Dashboard.md` |
| CREATE | `~/.claude/skills/ImageGeneratorNanoBananaPro/workflows/Infographic.md` |
| COPY+RENAME | `~/.claude/skills/ImageGeneratorNanoBananaPro/references/PromptLibrary.md` |
| COPY+RENAME | `~/.claude/skills/ImageGeneratorNanoBananaPro/references/PromptingGuide.md` |
| COPY+RENAME | `~/.claude/skills/ImageGeneratorNanoBananaPro/references/ApiReference.md` |
| COPY+RENAME | `~/.claude/skills/ImageGeneratorNanoBananaPro/references/Limitations.md` |
| COPY+RENAME | `~/.claude/skills/ImageGeneratorNanoBananaPro/references/SevenEngines.md` |
| CREATE | `~/.claude/skills/ImageGeneratorNanoBananaPro/tools/GenerateImage.ts` |

### Art Skill Kanonisierung

| Aktion | Von | Nach |
|--------|-----|------|
| RENAME | `~/.claude/skills/art/` | `~/.claude/skills/Art/` |
| EDIT | `Art/SKILL.md` | YAML-Frontmatter korrigieren |
| RENAME | 14 Workflow-Dateien | lowercase → TitleCase |
| RENAME | `generate-ulart-image.ts` | `GenerateImage.ts` |

---

## Erweiterungsvorschläge

### Sofort umsetzbar:
1. **Multi-Model-Support** - Flux, GPT-image-1 als Alternativen (aus art-Skill übernehmen)
2. **Batch-Generation** - Mehrere Varianten parallel generieren
3. **Template-System** - Vordefinierte Styles für häufige Diagrammtypen

### Später möglich:
4. **Reference-Image-Support** - Stil von Beispielbildern übernehmen
5. **Voice-Integration** - Jarvis bestätigt generierte Bilder
6. **History-Integration** - Generierte Bilder in UOCS tracken
7. **Obsidian-Export** - Bilder direkt in Vault speichern

---

---

## Zusammenfassung der Änderungen

| Kategorie | Anzahl |
|-----------|--------|
| Neue Dateien (ImageGeneratorNanoBananaPro) | 11 |
| Umbenannte Dateien (Art Skill) | 16 |
| Editierte Dateien | 2 |
| **Gesamt** | **29** |

## Ausführungsreihenfolge

1. Art Skill → `Art/` umbenennen
2. Art SKILL.md korrigieren
3. Art Workflow-Dateien umbenennen
4. Art Tool-Datei umbenennen
5. ImageGeneratorNanoBananaPro Verzeichnis erstellen
6. SKILL.md + Workflows erstellen
7. References kopieren + umbenennen
8. GenerateImage.ts CLI-Tool erstellen
9. Test beider Skills
