# Graph Report - loomixx  (2026-10-12)

## Corpus Check
- 107 files · ~42,117 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 953 nodes · 1231 edges · 120 communities (59 shown, 61 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d660ac01`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- loomixx/src/App.tsx
- custom-fetch.ts
- dependencies
- cn
- cn
- mockup-sandbox/src/components/ui/carousel.tsx
- mockup-sandbox/src/lib/utils.ts
- loomixx/src/lib/utils.ts
- loomixx/src/hooks/use-toast.ts
- mockup-sandbox/src/hooks/use-toast.ts
- compilerOptions
- db/package.json
- compilerOptions
- loomixx/src/components/ui/pagination.tsx
- compilerOptions
- Beauty+ — Stack App (Mini Apps + CRM)
- loomixx/src/components/ui/item.tsx
- mockup-sandbox/src/components/ui/item.tsx
- app.ts
- mockup-sandbox/components.json
- Loomixx — Stack (Studio Website)
- package.json
- loomixx/components.json
- loomixx/src/components/ui/command.tsx
- loomixx/src/components/ui/menubar.tsx
- mockup-sandbox/src/components/ui/command.tsx
- mockup-sandbox/src/components/ui/menubar.tsx
- devDependencies
- loomixx/src/components/ui/field.tsx
- devDependencies
- loomixx/src/components/ui/carousel.tsx
- compilerOptions
- compilerOptions
- compilerOptions
- scripts/package.json
- loomixx/src/components/ui/form.tsx
- api-client-react/package.json
- loomixx/src/components/ui/chart.tsx
- compilerOptions
- loomixx/package.json
- loomixx/src/components/ui/context-menu.tsx
- loomixx/src/components/ui/dropdown-menu.tsx
- scripts/tsconfig.json
- loomixx/src/components/ui/card.tsx
- loomixx/src/components/ui/table.tsx
- api-spec/package.json
- api-zod/package.json
- loomixx/src/components/ui/drawer.tsx
- loomixx/src/components/ui/empty.tsx
- loomixx/src/components/ui/navigation-menu.tsx
- loomixx/src/components/ui/select.tsx
- loomixx/src/components/ui/toggle-group.tsx
- tsconfig.json
- loomixx/src/components/ui/input-otp.tsx
- orval.config.ts
- loomixx/src/components/ui/accordion.tsx
- loomixx/src/components/ui/tabs.tsx
- mockup-sandbox/src/components/ui/badge.tsx
- db/src/index.ts
- build.mjs
- loomixx/src/components/ui/sonner.tsx
- cmdk
- embla-carousel-react
- framer-motion
- @hookform/resolvers
- input-otp
- lucide-react
- next-themes
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-aspect-ratio
- @radix-ui/react-checkbox
- @radix-ui/react-collapsible
- @radix-ui/react-context-menu
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-menubar
- @radix-ui/react-navigation-menu
- @radix-ui/react-popover
- @radix-ui/react-radio-group
- @radix-ui/react-scroll-area
- @radix-ui/react-slider
- @radix-ui/react-toast
- @radix-ui/react-toggle
- @radix-ui/react-toggle-group
- @radix-ui/react-tooltip
- react
- react-day-picker
- react-dom
- react-hook-form
- react-icons
- react-resizable-panels
- recharts
- @replit/vite-plugin-cartographer
- @replit/vite-plugin-dev-banner
- @replit/vite-plugin-runtime-error-modal
- sonner
- tailwindcss
- @tailwindcss/vite
- @tanstack/react-query
- @types/node
- @types/react
- @types/react-dom
- vaul
- vite
- @vitejs/plugin-react
- @workspace/api-client-react
- wouter
- zod
- loomixx/vite.config.ts
- date-fns
- @hookform/resolvers
- @radix-ui/react-slider
- loomixx/src/components/ui/accordion.tsx
- hero-rotating-phrase.tsx
- loomixx/src/components/ui/avatar.tsx
- mockup-sandbox/src/components/ui/tabs.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 140 edges
2. `compilerOptions` - 23 edges
3. `customFetch()` - 11 edges
4. `Loomixx — Stack (Studio Website)` - 10 edges
5. `compilerOptions` - 9 edges
6. `AiPanel()` - 8 edges
7. `ErrorBoundary` - 8 edges
8. `parseErrorBody()` - 8 edges
9. `compilerOptions` - 7 edges
10. `compilerOptions` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  artifacts/loomixx/src/components/ui/alert-dialog.tsx → artifacts/loomixx/src/lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  artifacts/loomixx/src/components/ui/alert-dialog.tsx → artifacts/loomixx/src/lib/utils.ts
- `BreadcrumbSeparator()` --calls--> `cn()`  [EXTRACTED]
  artifacts/loomixx/src/components/ui/breadcrumb.tsx → artifacts/loomixx/src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  artifacts/loomixx/src/components/ui/breadcrumb.tsx → artifacts/loomixx/src/lib/utils.ts
- `ButtonGroupText()` --calls--> `cn()`  [EXTRACTED]
  artifacts/loomixx/src/components/ui/button-group.tsx → artifacts/loomixx/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (120 total, 61 thin omitted)

### Community 0 - "loomixx/src/App.tsx"
Cohesion: 0.07
Nodes (12): brushNoise(), BrushPath, BrushPoint, makeBrushPaths(), makeBrushWisp(), navItems, projects, queryClient (+4 more)

### Community 1 - "custom-fetch.ts"
Cohesion: 0.08
Nodes (41): ApiError, applyBaseUrl(), AuthTokenGetter, BodyType, buildErrorMessage(), customFetch(), CustomFetchOptions, ErrorType (+33 more)

### Community 2 - "dependencies"
Cohesion: 0.05
Nodes (43): dependencies, cookie-parser, cors, drizzle-orm, express, pino, pino-http, @workspace/api-zod (+35 more)

### Community 3 - "cn"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 4 - "cn"
Cohesion: 0.10
Nodes (34): ResizableHandle(), ResizablePanelGroup(), SheetHeader(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter() (+26 more)

### Community 5 - "mockup-sandbox/src/components/ui/carousel.tsx"
Cohesion: 0.40
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 6 - "mockup-sandbox/src/lib/utils.ts"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

### Community 7 - "loomixx/src/lib/utils.ts"
Cohesion: 0.07
Nodes (17): Avatar, AvatarFallback, AvatarImage, Badge(), BadgeProps, badgeVariants, Checkbox, HoverCardContent (+9 more)

### Community 8 - "loomixx/src/hooks/use-toast.ts"
Cohesion: 0.12
Nodes (24): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+16 more)

### Community 9 - "mockup-sandbox/src/hooks/use-toast.ts"
Cohesion: 0.50
Nodes (3): BASE_PATH, PORT, deploy.sh script

### Community 11 - "db/package.json"
Cohesion: 0.08
Nodes (25): drizzle-kit, drizzle-zod, dependencies, drizzle-orm, drizzle-zod, pg, zod, devDependencies (+17 more)

### Community 12 - "compilerOptions"
Cohesion: 0.08
Nodes (25): workspace, compilerOptions, alwaysStrict, customConditions, incremental, isolatedModules, lib, module (+17 more)

### Community 13 - "loomixx/src/components/ui/pagination.tsx"
Cohesion: 0.06
Nodes (33): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+25 more)

### Community 14 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowImportingTsExtensions, jsx, lib, moduleResolution, noEmit, paths, resolveJsonModule (+16 more)

### Community 16 - "loomixx/src/components/ui/item.tsx"
Cohesion: 0.18
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

### Community 18 - "app.ts"
Cohesion: 0.16
Nodes (7): app, port, logger, router, router, HealthCheckResponse, HealthStatus

### Community 20 - "Loomixx — Stack (Studio Website)"
Cohesion: 0.11
Nodes (17): Agent workflow, API, Apps / packages, Architecture, Backend (`artifacts/api-server`), Data / contracts, Do / Don't, Frontend (`artifacts/loomixx`) (+9 more)

### Community 21 - "package.json"
Cohesion: 0.11
Nodes (17): dependencies, @replit/connectors-sdk, devDependencies, prettier, typescript, license, name, private (+9 more)

### Community 22 - "loomixx/components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 23 - "loomixx/src/components/ui/command.tsx"
Cohesion: 0.12
Nodes (14): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut() (+6 more)

### Community 24 - "loomixx/src/components/ui/menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 27 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, clsx, date-fns, @radix-ui/react-label, @radix-ui/react-progress, @radix-ui/react-separator, @radix-ui/react-switch, tailwind-merge (+7 more)

### Community 28 - "loomixx/src/components/ui/field.tsx"
Cohesion: 0.13
Nodes (16): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Field(), FieldContent(), FieldDescription(), FieldError() (+8 more)

### Community 31 - "loomixx/src/components/ui/carousel.tsx"
Cohesion: 0.14
Nodes (11): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+3 more)

### Community 32 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, composite, declarationMap, emitDeclarationOnly, lib, outDir, rootDir, extends (+5 more)

### Community 33 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, incremental, outDir, rootDir, tsBuildInfoFile, types, extends, include (+4 more)

### Community 37 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, composite, declarationMap, emitDeclarationOnly, outDir, rootDir, types, extends (+4 more)

### Community 38 - "scripts/package.json"
Cohesion: 0.15
Nodes (12): devDependencies, tsx, @types/node, @types/node, name, private, scripts, hello (+4 more)

### Community 39 - "loomixx/src/components/ui/form.tsx"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 41 - "api-client-react/package.json"
Cohesion: 0.17
Nodes (11): dependencies, @tanstack/react-query, exports, react, @tanstack/react-query, name, peerDependencies, react (+3 more)

### Community 42 - "loomixx/src/components/ui/chart.tsx"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 44 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, composite, declarationMap, emitDeclarationOnly, outDir, rootDir, extends, include (+2 more)

### Community 45 - "loomixx/package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, serve, typecheck, type (+1 more)

### Community 46 - "loomixx/src/components/ui/context-menu.tsx"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 47 - "loomixx/src/components/ui/dropdown-menu.tsx"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 52 - "scripts/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, outDir, rootDir, types, extends, include, node, src (+1 more)

### Community 53 - "loomixx/src/components/ui/card.tsx"
Cohesion: 0.28
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 54 - "loomixx/src/components/ui/table.tsx"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 56 - "api-spec/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, orval, name, private, scripts, codegen, version, orval

### Community 57 - "api-zod/package.json"
Cohesion: 0.22
Nodes (8): dependencies, zod, exports, zod, name, private, type, version

### Community 59 - "loomixx/src/components/ui/drawer.tsx"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 60 - "loomixx/src/components/ui/empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 61 - "loomixx/src/components/ui/navigation-menu.tsx"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 62 - "loomixx/src/components/ui/select.tsx"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 70 - "loomixx/src/components/ui/toggle-group.tsx"
Cohesion: 0.21
Nodes (10): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+2 more)

### Community 72 - "tsconfig.json"
Cohesion: 0.33
Nodes (5): compileOnSave, extends, files, ./tsconfig.base.json, references

### Community 73 - "loomixx/src/components/ui/input-otp.tsx"
Cohesion: 0.21
Nodes (5): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, ErrorFallbackProps, toError()

### Community 76 - "orval.config.ts"
Cohesion: 0.40
Nodes (3): apiClientReactSrc, apiZodSrc, root

### Community 77 - "loomixx/src/components/ui/accordion.tsx"
Cohesion: 0.12
Nodes (20): AI_CONTACT, AI_LOADING_PHRASES, AI_PLACEHOLDERS, AiDock(), AiPanel(), AiPanelProps, AiScrollBox(), autosizeEditable() (+12 more)

### Community 80 - "loomixx/src/components/ui/tabs.tsx"
Cohesion: 0.25
Nodes (7): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetOverlay, SheetTitle, sheetVariants

### Community 81 - "mockup-sandbox/src/components/ui/badge.tsx"
Cohesion: 0.83
Nodes (3): canStartViewTransition(), prefersReducedMotion(), useViewTransitionLocation()

### Community 145 - "date-fns"
Cohesion: 0.33
Nodes (7): HeroOrbitScene(), EASE, isHomePath(), shouldShowSplash(), SplashScreen(), markHeroMediaReady(), waitForHeroMediaReady()

### Community 167 - "@radix-ui/react-slider"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 182 - "loomixx/src/components/ui/accordion.tsx"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 204 - "hero-rotating-phrase.tsx"
Cohesion: 0.50
Nodes (3): EASE, HERO_ROTATING_PHRASES, HeroRotatingPhrase()

### Community 205 - "loomixx/src/components/ui/avatar.tsx"
Cohesion: 0.67
Nodes (3): BlurText(), BlurTextProps, buildKeyframes()

## Knowledge Gaps
- **461 isolated node(s):** `artifactDir`, `name`, `version`, `private`, `type` (+456 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `cn`, `mockup-sandbox/src/components/ui/carousel.tsx`, `mockup-sandbox/src/lib/utils.ts`, `loomixx/src/lib/utils.ts`, `loomixx/src/hooks/use-toast.ts`, `compilerOptions`, `loomixx/src/components/ui/pagination.tsx`, `loomixx/src/components/ui/item.tsx`, `loomixx/src/components/ui/command.tsx`, `loomixx/src/components/ui/menubar.tsx`, `loomixx/src/components/ui/field.tsx`, `loomixx/src/components/ui/carousel.tsx`, `@radix-ui/react-slider`, `loomixx/src/components/ui/form.tsx`, `loomixx/src/components/ui/chart.tsx`, `loomixx/src/components/ui/context-menu.tsx`, `loomixx/src/components/ui/dropdown-menu.tsx`, `loomixx/src/components/ui/card.tsx`, `loomixx/src/components/ui/accordion.tsx`, `loomixx/src/components/ui/table.tsx`, `loomixx/src/components/ui/drawer.tsx`, `loomixx/src/components/ui/empty.tsx`, `loomixx/src/components/ui/navigation-menu.tsx`, `loomixx/src/components/ui/select.tsx`, `loomixx/src/components/ui/toggle-group.tsx`, `loomixx/src/components/ui/avatar.tsx`, `loomixx/src/components/ui/tabs.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `tailwindcss`, `@tailwindcss/vite`, `@tanstack/react-query`, `@types/node`, `@types/react`, `@types/react-dom`, `vaul`, `vite`, `@vitejs/plugin-react`, `@workspace/api-client-react`, `wouter`, `zod`, `Beauty+ — Stack App (Mini Apps + CRM)`, `mockup-sandbox/src/components/ui/item.tsx`, `mockup-sandbox/components.json`, `@hookform/resolvers`, `mockup-sandbox/src/components/ui/command.tsx`, `mockup-sandbox/src/components/ui/menubar.tsx`, `devDependencies`, `loomixx/package.json`, `mockup-sandbox/src/components/ui/tabs.tsx`, `cmdk`, `embla-carousel-react`, `framer-motion`, `@hookform/resolvers`, `input-otp`, `lucide-react`, `next-themes`, `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-radio-group`, `@radix-ui/react-scroll-area`, `@radix-ui/react-slider`, `@radix-ui/react-toast`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@radix-ui/react-tooltip`, `react`, `react-day-picker`, `react-dom`, `react-hook-form`, `react-icons`, `react-resizable-panels`, `recharts`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal`, `sonner`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `ErrorBoundary` connect `loomixx/src/components/ui/input-otp.tsx` to `loomixx/src/App.tsx`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `artifactDir`, `name`, `version` to the rest of the system?**
  _461 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `loomixx/src/App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07311827956989247 - nodes in this community are weakly interconnected._
- **Should `custom-fetch.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08140610545790934 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._