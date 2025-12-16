// Eine Liste, um die Reihenfolge der Tabs zu speichern
let tabHistory = [];

// Event: Wenn ein Tab aktiviert (angeklickt) wird
chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabId = activeInfo.tabId;

    // Entferne die ID, falls sie schon in der Liste ist (um Duplikate zu vermeiden)
    tabHistory = tabHistory.filter(id => id !== tabId);
    
    // Füge die aktuelle Tab-ID ans Ende der Liste hinzu
    tabHistory.push(tabId);
    
    // Optional: Begrenze die Historie auf z.B. 50 Einträge, um Speicher zu sparen
    if (tabHistory.length > 50) {
        tabHistory.shift();
    }
});

// Event: Wenn ein Tab geschlossen wird
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // Entferne den geschlossenen Tab aus der Historie
    tabHistory = tabHistory.filter(id => id !== tabId);

    // Wenn noch Tabs in der Historie sind
    if (tabHistory.length > 0) {
        // Hole den letzten Tab aus der Liste (das war der vorherige)
        const lastActiveTabId = tabHistory[tabHistory.length - 1];

        // Versuche, diesen Tab zu aktivieren
        chrome.tabs.update(lastActiveTabId, { active: true }).catch((error) => {
            // Falls der Tab nicht mehr existiert (Fehlerfall), entferne ihn auch
            console.log("Tab existiert nicht mehr, wird aus Historie entfernt.");
            tabHistory.pop();
        });
    }
});

// Event: Bereinigung, falls Tabs im Hintergrund ersetzt werden
chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
    tabHistory = tabHistory.filter(id => id !== removedTabId);
    tabHistory.push(addedTabId);
});