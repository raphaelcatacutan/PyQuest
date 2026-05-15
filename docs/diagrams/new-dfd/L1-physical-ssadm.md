# Level 1 DFD - Physical (SSADM)

Level: 1
Type: Physical
Notation: SSADM

Mermaid source:

    %%{init: {'flowchart': {'nodeSpacing': 70, 'rankSpacing': 105, 'curve': 'linear'}}}%%
    flowchart TB
        U([E1 User])
        P1[P1 AuthService Module]
        P2[P2 Skulpt Runtime Pipeline]
        P3[P3 Combat AI Engine]
        P4[P4 Dungeon and Trials Validator]
        P5[P5 Inventory Tree Module]
        P6[P6 React Rendering Layer]
        D1[(D1 Zustand Player Session)]
        D2[(D2 Zustand Inventory)]
        D3[(D3 Zustand Challenge Stores)]
        D4[(D4 Metrics LocalStorage)]
        D5[(D5 JSON Content Files)]
        D6[(D6 user-username Credentials)]
        U -->|React form state| P1
        P1 <--> D6
        P1 --> P2
        U -->|Monaco editor value| P2
        P2 <--> D5
        P2 --> P3
        P3 <--> D1
        P3 --> D4
        P3 --> P4
        P4 <--> D3
        P4 --> P5
        U -->|Drag and drop item actions| P5
        P5 <--> D2
        P5 --> P6
        P6 -->|React DOM and terminal updates| U
