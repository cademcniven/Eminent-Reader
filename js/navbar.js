//show the settings menu and adjust the logo
const logo = document.getElementsByClassName('logo')[0]
logo.addEventListener('click', event => {
    const menu = document.getElementsByClassName('navMenu')[0]
    const spacer = document.getElementById('logoSpacer')
    menu.classList.toggle('hidden')
    logo.classList.toggle('fixedLogo')
    spacer.classList.toggle('logoPadding')
})

/**************************************************** 
 * QR Code
 ****************************************************/
const qr = new QRious({
    element: document.getElementById('qr'),
    value: window.location.href,
    size: 300
})

document.getElementById('siteUrl').innerHTML =
    `<a href="${window.location.href}">${window.location.href}</a>`

/**************************************************** 
 * site theme options
 ****************************************************/
const siteThemeRadios = document.siteThemeForm.siteTheme
siteThemeRadios.forEach(radio => {
    radio.addEventListener('change', event => {
        if (event.currentTarget.checked) {
            UpdateSiteTheme(event.currentTarget.value)
        }
    })
})

function UpdateSiteTheme(theme) {
    const themeColors = GetSiteThemeColors(theme)

    fetch('/getUserSettings').then(res => {
        return res.json()
    })
        .then(settings => {
            settings = { ...settings, ...themeColors }

            console.log(settings)
            PostUserSettings(settings)
        })
}

function GetSiteThemeColors(theme) {
    switch (theme) {
        case 'light':
            return {
                '__foreground': '#373D3F',
                '__background': '#FEFEFA',
                '__header-foreground': 'var(--background)',
                '__header-background': 'var(--foreground)'
            }
        case 'dark':
            return {
                '__foreground': '#FEFEFA',
                '__background': '#373D3F',
                '__header-foreground': 'var(--foreground)',
                '__header-background': 'var(--background)'
            }
        case 'ultraLight':
            return {
                '__foreground': 'black',
                '__background': 'white',
                '__header-foreground': 'var(--background)',
                '__header-background': 'var(--foreground)'
            }
        case 'ultraDark':
            return {
                '__foreground': 'white',
                '__background': 'black',
                '__header-foreground': 'var(--foreground)',
                '__header-background': 'var(--background)'
            }
        default:
            console.error('stop fucking around in devtools')
            return {}
    }
}

/**************************************************** 
 * modal stuff
 ****************************************************/
const colors = document.querySelectorAll('.color')
const colorModal = document.getElementById('colorModal')
const modalColorName = document.getElementById('modalColorName')
const modalColorSquare = document.getElementById('modalColorSquare')
const modalColorReading = document.getElementById('modalColorReading')
const modalColorPreview = document.getElementById('colorPreview')
const snow = document.querySelectorAll('.snow g')

// If a browser doesn't support the dialog, then hide the
// dialog contents by default.
if (typeof colorModal.showModal !== 'function')
    colorModal.hidden = true

colors.forEach(color => {
    color.addEventListener('click', event => {
        if (typeof colorModal.showModal === "function") {
            let colorClicked = event.currentTarget
            UncheckRadios()
            PopulateModalData(colorClicked)
            UpdateColorPreview()

            colorModal.showModal()
        } else {
            console.error('Sorry, the <dialog> API is not supported by this browser.')
        }
    })
})

function UncheckRadios() {
    const radios = document.colorForm.readerColors
    radios.forEach(radio => {
        radio.checked = false
    })
}

function PopulateModalData(colorClicked) {
    modalColorName.innerText = colorClicked.dataset.name
    if (colorClicked.dataset.reading)
        modalColorReading.innerText = colorClicked.dataset.reading
    else
        modalColorReading.innerText = ""

    modalColorSquare.style.backgroundColor = colorClicked.dataset.color
    modalColorSquare.style.borderColor = GetColorSquareBorderColor(colorClicked.dataset.color)
}

function GetColorSquareBorderColor(bgColor) {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor
    var r = parseInt(color.substring(0, 2), 16) // hexToR
    var g = parseInt(color.substring(2, 4), 16) // hexToG
    var b = parseInt(color.substring(4, 6), 16) // hexToB
    var uicolors = [r / 255, g / 255, b / 255]
    var c = uicolors.map((col) => {
        if (col <= 0.03928) {
            return col / 12.92
        }
        return Math.pow((col + 0.055) / 1.055, 2.4)
    })
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2])
    return (L > 0.179) ? '#000000' : '#ffffff'
}

function UpdateColorPreview(radioTarget, radioColor) {
    const foreground = getComputedStyle(document.documentElement)
        .getPropertyValue('--reader-foreground')
    const background = getComputedStyle(document.documentElement)
        .getPropertyValue('--reader-background')

    if (radioTarget == '--reader-background')
        modalColorPreview.style.backgroundColor = radioColor
    else
        modalColorPreview.style.backgroundColor = background

    snow.forEach(snowLayer => {
        if (radioTarget == '--reader-foreground')
            snowLayer.style.fill = radioColor
        else
            snowLayer.style.fill = foreground
    });
}

//modal color preview
const readerColorRadios = document.colorForm.readerColors
readerColorRadios.forEach(radio => {
    radio.addEventListener('change', event => {
        if (event.currentTarget.checked) {
            let color = modalColorSquare.style.backgroundColor
            UpdateColorPreview(event.currentTarget.value, color)
        }
    })
})

//modal submit
const colorModalSubmitButton = document.getElementById('colorModalConfirm')
colorModalSubmitButton.addEventListener('click', event => {
    readerColorRadios.forEach(radio => {
        if (radio.checked) {
            document.documentElement.style
                .setProperty(radio.value, modalColorSquare.style.backgroundColor)
        }
    })

    UpdateUserSettings()
})

function UpdateUserSettings() {
    const readerForeground = getComputedStyle(document.documentElement)
        .getPropertyValue('--reader-foreground')
    const readerBackground = getComputedStyle(document.documentElement)
        .getPropertyValue('--reader-background')

    fetch('/getUserSettings').then(res => {
        return res.json()
    })
        .then(settings => {
            settings['__reader_foreground'] = readerForeground
            settings['__reader_background'] = readerBackground

            PostUserSettings(settings)
        })
}

function PostUserSettings(settings) {
    fetch('setUserSettings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
    }).then(response => response.json())
        .catch((error) => {
            console.error('Error:', error)
        })
}