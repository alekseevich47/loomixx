# Graph Report - loomixx  (2026-10-07)

## Corpus Check
- 72 files · ~29,798 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 632 nodes · 888 edges · 100 communities (42 shown, 58 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- carousel.tsx
- sidebar.tsx
- App.tsx
- use-toast.ts
- compilerOptions
- ai-assistant.tsx
- cn
- components.json
- command.tsx
- menubar.tsx
- staggered-text.tsx
- utils.ts
- devDependencies
- form.tsx
- error-boundary.tsx
- item.tsx
- input-group.tsx
- package.json
- chart.tsx
- context-menu.tsx
- dropdown-menu.tsx
- card.tsx
- sheet.tsx
- table.tsx
- breadcrumb.tsx
- drawer.tsx
- empty.tsx
- navigation-menu.tsx
- select.tsx
- button-group.tsx
- toggle-group.tsx
- makeBrushPaths
- alert.tsx
- input-otp.tsx
- hero-rotating-phrase.tsx
- accordion.tsx
- avatar.tsx
- badge.tsx
- tabs.tsx
- use-view-transition-location.ts
- radio-group.tsx
- sonner.tsx
- clsx
- cmdk
- date-fns
- embla-carousel-react
- @hookform/resolvers
- input-otp
- lucide-react
- next-themes
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-aspect-ratio
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-collapsible
- @radix-ui/react-context-menu
- @radix-ui/react-hover-card
- @radix-ui/react-label
- @radix-ui/react-navigation-menu
- @radix-ui/react-popover
- @radix-ui/react-progress
- @radix-ui/react-scroll-area
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-slot
- @radix-ui/react-switch
- @radix-ui/react-tabs
- @radix-ui/react-toast
- @radix-ui/react-toggle
- @radix-ui/react-toggle-group
- @radix-ui/react-tooltip
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
- tailwind-merge
- tailwindcss
- @tailwindcss/typography
- @tailwindcss/vite
- @tanstack/react-query
- tw-animate-css
- @types/node
- @types/react
- @types/react-dom
- vaul
- vite
- @vitejs/plugin-react
- wouter
- zod
- vite.config.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 140 edges
2. `react` - 11 edges
3. `compilerOptions` - 9 edges
4. `AiPanel()` - 8 edges
5. `ErrorBoundary` - 8 edges
6. `tailwind` - 6 edges
7. `aliases` - 6 edges
8. `buttonVariants` - 6 edges
9. `useSidebar()` - 6 edges
10. `StaggeredText()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `useCarousel()` --references--> `react`  [EXTRACTED]
  src/components/ui/carousel.tsx → package.json
- `useChart()` --references--> `react`  [EXTRACTED]
  src/components/ui/chart.tsx → package.json
- `useFormField()` --references--> `react`  [EXTRACTED]
  src/components/ui/form.tsx → package.json
- `SidebarMenuSkeleton()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `SidebarProvider()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json

## Import Cycles
- None detected.

## Communities (100 total, 58 thin omitted)

### Community 0 - "carousel.tsx"
Cohesion: 0.06
Nodes (38): react, react, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader() (+30 more)

### Community 1 - "sidebar.tsx"
Cohesion: 0.07
Nodes (31): Input, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+23 more)

### Community 2 - "App.tsx"
Cohesion: 0.07
Nodes (8): BrushPath, BrushPoint, navItems, projects, queryClient, SelectionRect, serviceItems, HeroOrbitScene()

### Community 3 - "use-toast.ts"
Cohesion: 0.12
Nodes (24): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+16 more)

### Community 4 - "compilerOptions"
Cohesion: 0.08
Nodes (24): build, dist, dom, dom.iterable, esnext, node, node_modules, src/**/* (+16 more)

### Community 5 - "ai-assistant.tsx"
Cohesion: 0.12
Nodes (20): AI_CONTACT, AI_LOADING_PHRASES, AI_PLACEHOLDERS, AiDock(), AiPanel(), AiPanelProps, AiScrollBox(), autosizeEditable() (+12 more)

### Community 6 - "cn"
Cohesion: 0.17
Nodes (17): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+9 more)

### Community 7 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 8 - "command.tsx"
Cohesion: 0.12
Nodes (14): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut() (+6 more)

### Community 9 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 10 - "staggered-text.tsx"
Cohesion: 0.17
Nodes (13): EASE, shouldShowSplash(), SplashScreen(), waitForReady(), AsTag, Direction, offsetFor(), SegmentBy (+5 more)

### Community 11 - "utils.ts"
Cohesion: 0.12
Nodes (8): Checkbox, HoverCardContent, PopoverContent, Progress, ScrollArea, ScrollBar, Slider, Switch

### Community 12 - "devDependencies"
Cohesion: 0.13
Nodes (15): class-variance-authority, framer-motion, devDependencies, class-variance-authority, framer-motion, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-menubar (+7 more)

### Community 13 - "form.tsx"
Cohesion: 0.15
Nodes (11): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+3 more)

### Community 14 - "error-boundary.tsx"
Cohesion: 0.21
Nodes (5): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, ErrorFallbackProps, toError()

### Community 15 - "item.tsx"
Cohesion: 0.18
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

### Community 16 - "input-group.tsx"
Cohesion: 0.24
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

### Community 17 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, serve, typecheck, type (+1 more)

### Community 18 - "chart.tsx"
Cohesion: 0.20
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 19 - "context-menu.tsx"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 20 - "dropdown-menu.tsx"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 21 - "card.tsx"
Cohesion: 0.28
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 22 - "sheet.tsx"
Cohesion: 0.22
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 23 - "table.tsx"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 24 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 25 - "drawer.tsx"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 26 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 27 - "navigation-menu.tsx"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 28 - "select.tsx"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 29 - "button-group.tsx"
Cohesion: 0.38
Nodes (5): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Separator

### Community 30 - "toggle-group.tsx"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 31 - "makeBrushPaths"
Cohesion: 0.40
Nodes (5): brushNoise(), makeBrushPaths(), makeBrushWisp(), SelectionBrush(), smoothOpenPath()

### Community 32 - "alert.tsx"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 33 - "input-otp.tsx"
Cohesion: 0.40
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 34 - "hero-rotating-phrase.tsx"
Cohesion: 0.50
Nodes (3): EASE, HERO_ROTATING_PHRASES, HeroRotatingPhrase()

### Community 35 - "accordion.tsx"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 36 - "avatar.tsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 37 - "badge.tsx"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

### Community 38 - "tabs.tsx"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

### Community 39 - "use-view-transition-location.ts"
Cohesion: 0.83
Nodes (3): canStartViewTransition(), prefersReducedMotion(), useViewTransitionLocation()

## Knowledge Gaps
- **289 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+284 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **58 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `carousel.tsx`, `sidebar.tsx`, `use-toast.ts`, `command.tsx`, `menubar.tsx`, `staggered-text.tsx`, `utils.ts`, `form.tsx`, `item.tsx`, `input-group.tsx`, `chart.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `card.tsx`, `sheet.tsx`, `table.tsx`, `breadcrumb.tsx`, `drawer.tsx`, `empty.tsx`, `navigation-menu.tsx`, `select.tsx`, `button-group.tsx`, `toggle-group.tsx`, `alert.tsx`, `input-otp.tsx`, `accordion.tsx`, `avatar.tsx`, `badge.tsx`, `tabs.tsx`, `radio-group.tsx`?**
  _High betweenness centrality (0.483) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `carousel.tsx`, `package.json`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `@hookform/resolvers`, `input-otp`, `lucide-react`, `next-themes`, `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-label`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-slot`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@radix-ui/react-tooltip`, `react-day-picker`, `react-dom`, `react-hook-form`, `react-icons`, `react-resizable-panels`, `recharts`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal`, `sonner`, `tailwind-merge`, `tailwindcss`, `@tailwindcss/typography`, `@tailwindcss/vite`, `@tanstack/react-query`, `tw-animate-css`, `@types/node`, `@types/react`, `@types/react-dom`, `vaul`, `vite`, `@vitejs/plugin-react`, `wouter`, `zod`?**
  _High betweenness centrality (0.346) - this node is a cross-community bridge._
- **Why does `react` connect `carousel.tsx` to `sidebar.tsx`, `use-toast.ts`, `devDependencies`?**
  _High betweenness centrality (0.309) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _289 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `carousel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05758582502768549 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._