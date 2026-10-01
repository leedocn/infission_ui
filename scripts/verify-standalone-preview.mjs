import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const semanticTokenExpectations = {
  "packages/infisson_ui/src/global/styles.css": [
    "--inf-global-ai-widget-bg",
    "--inf-global-ai-widget-fg",
    "--inf-global-ai-widget-muted",
    "--inf-global-ai-widget-accent",
    "--inf-global-risk-card-bg",
    "--inf-global-risk-card-fg",
    "--inf-global-risk-card-muted",
    "--inf-global-risk-card-accent",
    "--inf-global-compliance-score-bg",
    "--inf-global-compliance-score-fg",
    "--inf-global-stat-brand-bg",
    "--inf-global-stat-brand-fg",
    "--inf-global-stat-dark-bg",
    "--inf-global-stat-dark-fg",
    "--inf-global-ai-widget-switch-track-off",
    "--inf-global-ai-widget-switch-track-on",
    "--inf-global-ai-widget-switch-thumb",
  ],
  "packages/infisson_ui/src/tokens.css": [
    "--inf-color-on-surface-inverse",
    "--inf-color-on-inverse-accent",
    "--inf-global-ai-widget-switch-track-off",
    "--inf-global-ai-widget-switch-track-on",
    "--inf-global-ai-widget-switch-thumb",
  ],
};
const semanticTokenMissing = Object.entries(semanticTokenExpectations).flatMap(([path, tokens]) => {
  const source = readFileSync(resolve(path), "utf8");
  return tokens.filter((token) => !source.includes(token)).map((token) => `${path}: ${token}`);
});
const semanticTokenDocs = {
  "docs/components/global/sidebaraiwidget.zh-en.md": ["--inf-global-ai-widget-bg", "--inf-global-ai-widget-fg", "--inf-global-ai-widget-muted", "--inf-global-ai-widget-accent", "--inf-global-ai-widget-switch-track-off", "--inf-global-ai-widget-switch-track-on", "--inf-global-ai-widget-switch-thumb"],
  "docs/components/global/airiskcard.zh-en.md": ["--inf-global-risk-card-bg", "--inf-global-risk-card-fg", "--inf-global-risk-card-muted", "--inf-global-risk-card-accent"],
  "docs/components/global/packagecompliancecard.zh-en.md": ["--inf-global-compliance-score-bg", "--inf-global-compliance-score-fg"],
  "docs/components/global/portfoliostats.zh-en.md": ["--inf-global-stat-brand-bg", "--inf-global-stat-brand-fg", "--inf-global-stat-dark-bg", "--inf-global-stat-dark-fg"],
};
const semanticDocMissing = Object.entries(semanticTokenDocs).flatMap(([path, tokens]) => {
  const source = readFileSync(resolve(path), "utf8");
  return tokens.filter((token) => !source.includes(token)).map((token) => `${path}: ${token}`);
});

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(`file:///${resolve("index.html").replaceAll("\\", "/")}`);
await page.waitForSelector("[data-component='A01 · BrandLogo']");
const checks = {
  title: await page.title(),
  bytesLoaded: await page.evaluate(() => document.documentElement.outerHTML.length),
  globalTiles: await page.locator("#global [data-component]").count(),
  detailTiles: await page.locator("#detail [data-component]").count(),
  workflowTiles: await page.locator("#workflow [data-component]").count(),
  detailVisible: await page.locator("#detail").count(),
  workflowVisible: await page.locator("#workflow").count(),
  imageCount: await page.locator("img").count(),
  sectionThumbnails: await page.locator(".preview-section__heading img").count(),
  themeControls: await page.locator(".preview-theme-control select").count(),
  themeOptionCount: await page.locator("#global .preview-theme-control select option").count(),
  brokenImages: await page.locator("img").evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).length),
  pageErrors: errors,
};
const appShell = page.locator("#global .inf-global-app-shell");
checks.appShell = await appShell.count();
checks.sidebarGroups = await appShell.locator(".inf-global-app-shell__nav .inf-global-nav-group").count();
checks.sidebarItems = await appShell.locator(".inf-global-app-shell__nav .inf-global-nav-item").count();
const sidebarNav = appShell.locator(".inf-global-app-shell__nav");
checks.sidebarLabels = await sidebarNav.getByText("Overview", { exact: true }).count() + await sidebarNav.getByText("Projects", { exact: true }).count() + await sidebarNav.getByText("Permits", { exact: true }).count() + await sidebarNav.getByText("Settings", { exact: true }).count();
await appShell.getByRole("button", { name: "Projects" }).click();
checks.shellNavigationFeedback = await page.locator("#global .preview-shell-feedback").filter({ hasText: "Projects selected" }).count();
const collapseButton = appShell.getByRole("button", { name: "Collapse sidebar" });
await collapseButton.click();
checks.sidebarCollapsed = await appShell.getByRole("button", { name: "Expand sidebar" }).count();
await appShell.getByRole("button", { name: "Expand sidebar" }).click();
checks.missingComponentIds = await page.evaluate(() => {
  const expected = [...Array.from({ length: 37 }, (_, index) => `A${String(index + 1).padStart(2, "0")}`), ...Array.from({ length: 28 }, (_, index) => `B${String(index + 1).padStart(2, "0")}`), ...Array.from({ length: 36 }, (_, index) => `C${String(index + 1).padStart(2, "0")}`)];
  const found = new Set([...document.querySelectorAll("[data-component]")].map((node) => node.getAttribute("data-component")?.slice(0, 3)));
  return expected.filter((id) => !found.has(id));
});
await page.locator("#workflow button", { hasText: "AI fix approval" }).click();
checks.dialogVisible = await page.getByRole("dialog").count();
await page.getByRole("dialog").getByRole("button", { name: "Close dialog", exact: true }).click();
const aiSwitch = page.locator("#global [data-component^='A07'] [role='switch']").first();
checks.aiSwitchBefore = await aiSwitch.getAttribute("aria-checked");
await aiSwitch.click();
checks.aiSwitchAfter = await aiSwitch.getAttribute("aria-checked");
const workspaceTile = page.locator("#global [data-component^='A02']");
await workspaceTile.getByRole("button", { name: /Northstar Works/ }).click();
await workspaceTile.getByRole("menuitem", { name: /Bluefern Studio/ }).click();
checks.workspaceSelection = await workspaceTile.getByRole("status").textContent();
const profileTile = page.locator("#global [data-component^='A08']");
await profileTile.getByRole("button", { name: /^Avery Chen/ }).click();
checks.profilePanelVisible = await profileTile.getByRole("region", { name: "Profile actions" }).count();
await profileTile.getByRole("button", { name: "Close", exact: true }).click();
checks.profilePanelClosed = await profileTile.getByRole("region", { name: "Profile actions" }).count();
await profileTile.getByRole("button", { name: "More actions for Avery Chen" }).click();
checks.profileMenuVisible = await profileTile.getByRole("menu", { name: "More actions for Avery Chen" }).count();
await profileTile.getByRole("menuitem", { name: "View profile" }).click();
checks.profileMenuAction = await profileTile.getByText("Profile details opened", { exact: true }).count();
const searchTile = page.locator("#global [data-component^='A09']");
const searchInput = searchTile.getByRole("textbox", { name: "Search projects" });
checks.searchIcon = await searchTile.locator(".inf-global-search__icon svg").count();
checks.searchSubmitHint = await searchTile.getByLabel("Submit search").count();
await searchInput.fill("Meridian Way");
await searchInput.press("Enter");
checks.searchSubmitted = await searchTile.getByText("Last search: Meridian Way", { exact: true }).count();
const notificationTile = page.locator("#global [data-component^='A10']");
await notificationTile.getByRole("button", { name: "Notifications" }).click();
checks.notificationsOpen = await notificationTile.getByRole("region", { name: "Notifications panel" }).count();
await notificationTile.getByRole("button", { name: "Close", exact: true }).click();
checks.notificationsClosed = await notificationTile.getByRole("region", { name: "Notifications panel" }).count();
const primaryTile = page.locator("#global [data-component^='A11']");
await primaryTile.getByRole("button", { name: "New project" }).click();
checks.primaryAction = await primaryTile.getByText("new project action fired", { exact: true }).count();
const secondaryTile = page.locator("#global [data-component^='A12']");
await secondaryTile.getByRole("button", { name: "Permit package" }).click();
checks.secondaryAction = await secondaryTile.getByText("permit package action fired", { exact: true }).count();
const filterTile = page.locator("#global [data-component^='A14']");
await filterTile.getByRole("button", { name: "All, 128" }).click();
checks.filterDeselected = await filterTile.getByText("Filter not selected", { exact: true }).count();
await filterTile.getByRole("button", { name: "Remove All" }).click();
checks.filterRemoved = await filterTile.getByText("Filter removed", { exact: true }).count();
await filterTile.getByRole("button", { name: "Restore filter" }).click();
checks.filterRestored = await filterTile.getByText("Filter selected", { exact: true }).count();
const documentGroupTile = page.locator("#detail [data-component^='B17']");
await documentGroupTile.getByRole("button", { name: "More actions for Site Plan v3.pdf" }).click();
checks.documentGroupMenuAction = await page.locator("#detail .preview-shell-feedback").filter({ hasText: "Site Plan v3.pdf menu opened" }).count();
const packageContentTile = page.locator("#workflow [data-component^='C12']");
const hideDocument = packageContentTile.getByRole("button", { name: "Hide Building Permit Application B-1" });
await hideDocument.click();
checks.documentHidden = await packageContentTile.getByRole("button", { name: "Show Building Permit Application B-1" }).getAttribute("aria-pressed");
await packageContentTile.getByRole("button", { name: "Show Building Permit Application B-1" }).click();
checks.documentShown = await packageContentTile.getByRole("button", { name: "Hide Building Permit Application B-1" }).getAttribute("aria-pressed");
if ((await aiSwitch.getAttribute("aria-checked")) === "false") await aiSwitch.click();
await page.locator("#global .preview-theme-control select").selectOption("rose-mocha");
checks.themeChanged = await page.locator(".preview-app").getAttribute("data-theme");
checks.themeBrandColor = await page.locator(".preview-app").evaluate((element) => getComputedStyle(element).getPropertyValue("--inf-color-brand").trim());
const themeExpectations = {
  default: ["#c5f33e", "#111214"], lime: ["#84cc16", "#0f172a"], "rose-mocha": ["#c86b85", "#8e4b61"],
  "mint-slate": ["#46c2b2", "#2e7d73"], vermilion: ["#af3e3e", "#8b1e1e"], italian: ["#cdc7b1", "#1d331e"],
  "rose-heart": ["#d94893", "#8f174f"], champagne: ["#d4af7c", "#886f47"], jade: ["#18a979", "#0f3a32"],
};
checks.themePalette = {};
for (const [theme, [brand, inverse]] of Object.entries(themeExpectations)) {
  await page.locator("#global .preview-theme-control select").selectOption(theme);
  await page.waitForTimeout(180);
  checks.themePalette[theme] = await page.locator(".preview-app").evaluate((element) => {
    const app = getComputedStyle(element);
    const resolveColor = (token, scope = element) => {
      const probe = document.createElement("span");
      probe.style.color = token;
      scope.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    };
    const brand = app.getPropertyValue("--inf-color-brand").trim();
    const onBrand = app.getPropertyValue("--inf-color-on-brand").trim();
    const success = app.getPropertyValue("--inf-color-success").trim();
    const switchTrackOff = app.getPropertyValue("--inf-global-ai-widget-switch-track-off").trim();
    const switchTrackOn = app.getPropertyValue("--inf-global-ai-widget-switch-track-on").trim();
    const switchThumb = app.getPropertyValue("--inf-global-ai-widget-switch-thumb").trim();
    const brandRgb = resolveColor(brand);
    const onBrandRgb = resolveColor(onBrand);
    const successRgb = resolveColor(success);
    const switchTrackOffRgb = resolveColor(switchTrackOff);
    const switchTrackOnRgb = resolveColor(switchTrackOn);
    const switchThumbRgb = resolveColor(switchThumb);
    const nav = document.querySelector("#global .inf-global-nav-item.is-active");
    const count = document.querySelector("#global .inf-global-nav-item__count");
    const brandStat = document.querySelector("#global .inf-global-stat--brand");
    const complianceCard = document.querySelector("#global .inf-global-compliance-card");
    const complianceScore = document.querySelector("#global .inf-global-compliance-card__score");
    const complianceScoreText = complianceScore?.querySelector("strong");
    const complianceScoreDetail = complianceScore?.querySelector("span");
    const aiWidget = document.querySelector("#global .inf-global-ai-widget");
    const aiSpark = aiWidget?.querySelector(".inf-global-ai-widget__spark");
    const aiCount = aiWidget?.querySelector(".inf-global-ai-widget__count");
    const aiSwitch = document.querySelector("#global [data-component^='A07'] .inf-global-switch");
    const aiSwitchOff = aiSwitch?.cloneNode(true);
    if (aiSwitchOff) {
      aiSwitchOff.classList.remove("is-on");
      aiSwitchOff.style.position = "fixed";
      aiSwitchOff.style.visibility = "hidden";
      (aiSwitch?.parentElement ?? document.body).append(aiSwitchOff);
    }
    const dark = document.querySelector("#global .inf-button--dark");
    const darkCard = document.querySelector("#global .inf-global-risk-card");
    const darkStat = document.querySelector("#global .inf-global-stat--dark");
    const onTrack = document.querySelector("#global .inf-workflow-badge--on-track");
    const aiWidgetMessage = aiWidget?.querySelector("p");
    const riskCardSmall = darkCard?.querySelector("small");
    const brandButton = document.querySelector("#global .inf-global-risk-card .inf-button--brand");
    const brandSample = document.querySelector("#global .reference-cluster-heading__number");
    const overrideHost = document.createElement("div");
    overrideHost.style.cssText = [
      "--inf-global-ai-widget-bg: rgb(18, 52, 86)",
      "--inf-global-ai-widget-fg: rgb(254, 254, 254)",
      "--inf-global-ai-widget-muted: rgb(170, 170, 170)",
      "--inf-global-ai-widget-accent: rgb(255, 220, 0)",
      "--inf-global-risk-card-bg: rgb(18, 52, 86)",
      "--inf-global-risk-card-fg: rgb(254, 254, 254)",
      "--inf-global-risk-card-muted: rgb(170, 170, 170)",
      "--inf-global-risk-card-accent: rgb(255, 220, 0)",
      "--inf-global-stat-dark-bg: rgb(18, 52, 86)",
      "--inf-global-stat-dark-fg: rgb(254, 254, 254)",
      "--inf-global-stat-brand-bg: rgb(18, 52, 86)",
      "--inf-global-stat-brand-fg: rgb(254, 254, 254)",
      "--inf-global-compliance-score-bg: rgb(18, 52, 86)",
      "--inf-global-compliance-score-fg: rgb(254, 254, 254)",
      "--inf-global-ai-widget-switch-track-off: rgb(4, 5, 6)",
      "--inf-global-ai-widget-switch-track-on: rgb(1, 2, 3)",
      "--inf-global-ai-widget-switch-thumb: rgb(7, 8, 9)",
    ].join(";");
    const scopedClone = (node) => {
      const clone = node?.cloneNode(true);
      if (clone) overrideHost.append(clone);
      return clone;
    };
    const scopedAi = scopedClone(aiWidget);
    const scopedRisk = scopedClone(darkCard);
    const scopedDarkStat = scopedClone(darkStat);
    const scopedBrandStat = scopedClone(brandStat);
    const scopedScore = scopedClone(complianceCard);
    document.body.append(overrideHost);
    const scopedSwitch = scopedAi?.querySelector(".inf-global-switch");
    const scopedSwitchOff = scopedSwitch?.cloneNode(true);
    if (scopedSwitchOff) {
      scopedSwitchOff.classList.remove("is-on");
      scopedSwitchOff.style.position = "fixed";
      scopedSwitchOff.style.visibility = "hidden";
      (scopedAi ?? overrideHost).append(scopedSwitchOff);
    }
    const scopedValues = {
      aiBg: scopedAi ? getComputedStyle(scopedAi).backgroundColor : "",
      aiFg: scopedAi ? getComputedStyle(scopedAi).color : "",
      riskBg: scopedRisk ? getComputedStyle(scopedRisk).backgroundColor : "",
      riskFg: scopedRisk ? getComputedStyle(scopedRisk).color : "",
      darkStatBg: scopedDarkStat ? getComputedStyle(scopedDarkStat).backgroundColor : "",
      darkStatFg: scopedDarkStat ? getComputedStyle(scopedDarkStat).color : "",
      brandStatBg: scopedBrandStat ? getComputedStyle(scopedBrandStat).backgroundColor : "",
      brandStatFg: scopedBrandStat ? getComputedStyle(scopedBrandStat).color : "",
      scoreBg: scopedScore?.querySelector(".inf-global-compliance-card__score") ? getComputedStyle(scopedScore.querySelector(".inf-global-compliance-card__score")).backgroundColor : "",
      scoreFg: scopedScore?.querySelector(".inf-global-compliance-card__score") ? getComputedStyle(scopedScore.querySelector(".inf-global-compliance-card__score")).color : "",
      switchOn: scopedSwitch ? getComputedStyle(scopedSwitch).backgroundColor : "",
      switchOff: scopedSwitchOff ? getComputedStyle(scopedSwitchOff).backgroundColor : "",
      switchThumb: scopedSwitch ? getComputedStyle(scopedSwitch.querySelector("span")).backgroundColor : "",
    };
    overrideHost.remove();
    const result = {
      brand,
      onBrand,
      success,
      successRgb,
      inverse: app.getPropertyValue("--inf-color-surface-inverse").trim(),
      inverseRgb: resolveColor(app.getPropertyValue("--inf-color-surface-inverse").trim()),
      brandRgb,
      onBrandRgb,
      onSurfaceInverse: app.getPropertyValue("--inf-color-on-surface-inverse").trim(),
      onSurfaceInverseRgb: resolveColor(app.getPropertyValue("--inf-color-on-surface-inverse").trim()),
      onInverseAccent: app.getPropertyValue("--inf-color-on-inverse-accent").trim(),
      nav: nav ? getComputedStyle(nav).backgroundColor : "",
      navCountColor: count ? getComputedStyle(count).color : "",
      brandStatColor: brandStat ? getComputedStyle(brandStat).color : "",
      complianceScoreBackground: complianceScore ? getComputedStyle(complianceScore).backgroundColor : "",
      complianceScoreColor: complianceScore ? getComputedStyle(complianceScore).color : "",
      complianceScoreTextColor: complianceScoreText ? getComputedStyle(complianceScoreText).color : "",
      complianceScoreDetailColor: complianceScoreDetail ? getComputedStyle(complianceScoreDetail).color : "",
      aiSparkColor: aiSpark ? getComputedStyle(aiSpark).color : "",
      aiCountColor: aiCount ? getComputedStyle(aiCount).color : "",
      switchTrackOff,
      switchTrackOn,
      switchThumb,
      switchTrackOffRgb,
      switchTrackOnRgb,
      switchThumbRgb,
      aiSwitchBackground: aiSwitch ? getComputedStyle(aiSwitch).backgroundColor : "",
      aiSwitchOffBackground: aiSwitchOff ? getComputedStyle(aiSwitchOff).backgroundColor : "",
      aiSwitchThumb: aiSwitch ? getComputedStyle(aiSwitch.querySelector("span")).backgroundColor : "",
      aiSwitchOffThumb: aiSwitchOff ? getComputedStyle(aiSwitchOff.querySelector("span")).backgroundColor : "",
      scopedValues,
      aiWidgetColor: aiWidget ? getComputedStyle(aiWidget).color : "",
      aiWidgetBgColor: aiWidget ? getComputedStyle(aiWidget).backgroundColor : "",
      aiWidgetFgColor: aiWidget ? getComputedStyle(aiWidget).color : "",
      aiWidgetMutedColor: aiWidgetMessage ? getComputedStyle(aiWidgetMessage).color : "",
      aiWidgetAccentColor: aiSpark ? getComputedStyle(aiSpark).color : "",
      riskCardBgColor: darkCard ? getComputedStyle(darkCard).backgroundColor : "",
      riskCardFgColor: darkCard ? getComputedStyle(darkCard).color : "",
      riskCardMutedColor: riskCardSmall ? getComputedStyle(riskCardSmall).color : "",
      brandStatBgColor: brandStat ? getComputedStyle(brandStat).backgroundColor : "",
      brandStatFgColor: brandStat ? getComputedStyle(brandStat).color : "",
      darkStatBgColor: darkStat ? getComputedStyle(darkStat).backgroundColor : "",
      darkStatFgColor: darkStat ? getComputedStyle(darkStat).color : "",
      complianceScoreBgColor: complianceScore ? getComputedStyle(complianceScore).backgroundColor : "",
      complianceScoreFgColor: complianceScore ? getComputedStyle(complianceScore).color : "",
      onTrackColor: onTrack ? getComputedStyle(onTrack).color : "",
      dark: dark ? getComputedStyle(dark).backgroundColor : "",
      darkCard: darkCard ? getComputedStyle(darkCard).backgroundColor : "",
      brandButton: brandButton ? getComputedStyle(brandButton).backgroundColor : "",
      brandButtonColor: brandButton ? getComputedStyle(brandButton).color : "",
      brandSample: brandSample ? getComputedStyle(brandSample).backgroundColor : "",
    };
    aiSwitchOff?.remove();
    return result;
  });
  checks.themePalette[theme].expected = { brand, inverse };
}
checks.themeSelectors = await page.locator(".preview-theme-control select").evaluateAll((selects) => selects.map((select) => select.value));
await page.locator("#global .preview-theme-control select").selectOption("default");
await page.screenshot({ path: resolve("artifacts/index-preview.png"), fullPage: true });
const mobile = await browser.newPage({ viewport: { width: 390, height: 1000 }, reducedMotion: "reduce" });
await mobile.goto(`file:///${resolve("index.html").replaceAll("\\", "/")}`);
checks.mobileAttentionFits = await mobile.locator("#global [data-component^='A19'] .inf-global-attention").evaluate((element) => element.scrollWidth <= element.clientWidth + 1);
checks.mobileCompactFits = await mobile.locator("#global [data-component^='A36'] .inf-global-compact-row").evaluate((element) => element.scrollWidth <= element.clientWidth + 1);
await mobile.close();
await browser.close();
checks.semanticTokenMissing = semanticTokenMissing;
checks.semanticDocMissing = semanticDocMissing;
console.log(JSON.stringify(checks, null, 2));
const themePalettePassed = Object.values(checks.themePalette).every((entry) => entry.brand === entry.expected.brand && entry.inverse === entry.expected.inverse && entry.brandRgb && entry.onBrandRgb && entry.successRgb && entry.nav && entry.dark === entry.nav && entry.darkCard === entry.nav && entry.brandButton === entry.brandSample && entry.navCountColor === entry.onBrandRgb && entry.onTrackColor === entry.successRgb && entry.brandStatColor === entry.onBrandRgb && entry.complianceScoreBackground === entry.brandRgb && entry.complianceScoreColor === entry.onBrandRgb && entry.complianceScoreTextColor === entry.onBrandRgb && entry.complianceScoreDetailColor === entry.onBrandRgb && entry.aiSparkColor === entry.aiWidgetAccentColor && entry.aiCountColor === entry.aiWidgetAccentColor && entry.switchTrackOffRgb && entry.switchTrackOnRgb && entry.switchThumbRgb && entry.aiSwitchBackground === entry.switchTrackOnRgb && entry.aiSwitchOffBackground === entry.switchTrackOffRgb && entry.aiSwitchThumb === entry.switchThumbRgb && entry.aiSwitchOffThumb === entry.switchThumbRgb && entry.aiSwitchBackground !== entry.aiSwitchOffBackground && entry.aiSwitchThumb !== entry.aiSwitchBackground && entry.aiSwitchThumb !== entry.aiSwitchOffBackground && entry.scopedValues?.aiBg === "rgb(18, 52, 86)" && entry.scopedValues?.aiFg === "rgb(254, 254, 254)" && entry.scopedValues?.riskBg === "rgb(18, 52, 86)" && entry.scopedValues?.riskFg === "rgb(254, 254, 254)" && entry.scopedValues?.darkStatBg === "rgb(18, 52, 86)" && entry.scopedValues?.darkStatFg === "rgb(254, 254, 254)" && entry.scopedValues?.brandStatBg === "rgb(18, 52, 86)" && entry.scopedValues?.brandStatFg === "rgb(254, 254, 254)" && entry.scopedValues?.scoreBg === "rgb(18, 52, 86)" && entry.scopedValues?.scoreFg === "rgb(254, 254, 254)" && entry.scopedValues?.switchOn === "rgb(1, 2, 3)" && entry.scopedValues?.switchOff === "rgb(4, 5, 6)" && entry.scopedValues?.switchThumb === "rgb(7, 8, 9)" && entry.aiWidgetBgColor === entry.inverseRgb && entry.aiWidgetColor === entry.aiWidgetFgColor && entry.riskCardBgColor === entry.inverseRgb && entry.riskCardFgColor === entry.onSurfaceInverseRgb && entry.brandStatBgColor === entry.brandRgb && entry.brandStatFgColor === entry.onBrandRgb && entry.darkStatBgColor === entry.inverseRgb && entry.darkStatFgColor === entry.onSurfaceInverseRgb && entry.complianceScoreBgColor === entry.brandRgb && entry.complianceScoreFgColor === entry.onBrandRgb && entry.brandButtonColor === entry.onBrandRgb);
if (semanticTokenMissing.length || semanticDocMissing.length || errors.length || checks.globalTiles !== 37 || checks.detailTiles !== 28 || checks.workflowTiles !== 36 || checks.brokenImages !== 0 || checks.sectionThumbnails !== 0 || checks.themeControls !== 3 || checks.themeOptionCount !== 9 || checks.themeChanged !== "rose-mocha" || !checks.themeBrandColor || !themePalettePassed || !checks.themeSelectors?.every((value) => value === "jade") || checks.missingComponentIds.length || checks.appShell !== 1 || checks.sidebarGroups !== 3 || checks.sidebarItems !== 12 || checks.sidebarLabels !== 4 || checks.sidebarCollapsed !== 1 || checks.shellNavigationFeedback !== 1 || checks.aiSwitchBefore !== "true" || checks.aiSwitchAfter !== "false" || !checks.workspaceSelection?.includes("Bluefern Studio") || checks.profilePanelVisible !== 1 || checks.profilePanelClosed !== 0 || checks.profileMenuVisible !== 1 || checks.profileMenuAction !== 1 || checks.searchIcon !== 1 || checks.searchSubmitHint !== 1 || checks.searchSubmitted !== 1 || checks.notificationsOpen !== 1 || checks.notificationsClosed !== 0 || checks.primaryAction !== 1 || checks.secondaryAction !== 1 || checks.filterDeselected !== 1 || checks.filterRemoved !== 1 || checks.filterRestored !== 1 || checks.documentGroupMenuAction !== 1 || checks.documentHidden !== "true" || checks.documentShown !== "false" || !checks.mobileAttentionFits || !checks.mobileCompactFits || !checks.detailVisible || !checks.workflowVisible) process.exit(1);





