import * as filters from 'housing';
import { query } from './rent/query';
import type { Option } from './rent/query';

import type { State, FilterOption } from 'housing';
import JSONFormatter from 'json-formatter-js';
import decrypt from './rent/decrypt';

// --- DOM Elements ---
const filterForm = document.getElementById('filter-form');
const tabEncodeBtn = document.getElementById('tab-encode');
const tabDecodeBtn = document.getElementById('tab-decode');
const encodingPanel = document.getElementById('encoding-panel');
const decodingPanel = document.getElementById('decoding-panel');
const decodingInputArea = document.getElementById('decoding-input-textarea');
const codeSubTabs = document.querySelectorAll('#encoding-panel button');
const codeBlocks = document.querySelectorAll('#encoding-panel div[id^="code-"]');
const togglePanelBtn = document.getElementById('toggle-panel-btn');
const rightPanel = document.getElementById('right-panel');

// --- Functions ---

/**
 * Updates the JSON viewer with an interactive tree.
 * @param {string} jsonString - The JSON string to parse and display.
 */
function updateJsonViewer(decodedObject: Object) {
    const jsonContainer = document.getElementById('decoded-json');
    if (!jsonContainer) return;
    jsonContainer.innerHTML = ''; // Clear previous content

    try {
        const formatter = new JSONFormatter(decodedObject, 1, {
            theme: 'dark'
        });
        jsonContainer.appendChild(formatter.render());
    } catch (e) {
        console.error(e)
        jsonContainer.innerHTML = '<pre class="text-red-400">Invalid JSON input.</pre>';
    }
}

function handleDecodingInput(this: HTMLInputElement) {
    const text = this.value;
    decrypt(text)
        .then(result => {
            updateJsonViewer(result);
        }).catch(e => {
            console.error(e);
            updateJsonViewer('.');
        })
}

function generateCode(url: string, headers: Record<string, string>) {
    // Convert headers object to a string for different formats
    const headerStrNode = JSON.stringify(headers, null, 2);
    const headerStrPython = JSON.stringify(headers, null, 4);
    const headerStrCurl = Object.keys(headers)
        .map(key => `-H "${key}: ${headers[key]}"`)
        .join(' \\\n');

    // Node.js code using `node-fetch`
    const nodejsCode = `
const axios = require('axios');

const url = '${url}';
const headers = ${headerStrNode};
const result = await axios.get(url, { headers: headers })
 .then( (response) => response.data);
  `;

    // Python code using `requests`
    const pythonCode = `
import requests

url = "${url}"
headers = ${headerStrPython}

response = requests.get(url, headers=headers)
result = response.text
  `;

    // cURL code for Bash
    const curlBashCode = `
curl -X GET "${url}" \\
${headerStrCurl}
  `;

    // cURL code for Windows Command Prompt
    const curlCmdCode = `
curl -X GET "${url}" ^
${Object.keys(headers).map(key => `-H "${key}: ${headers[key]}"`).join(' ^\n')}
  `;

    const generatedCode: Record<string, string> = {
        js: nodejsCode,
        py: pythonCode,
        curl_cmd: curlCmdCode,
        curl_bash: curlBashCode,
    };

    codeBlocks.forEach(block => {
        const pre = document.createElement('pre');
        pre.classList.add('overflow-x-auto');
        pre.textContent = generatedCode[block.id.split('-')[1]].trim();

        const button = document.createElement('button');
        button.classList.add(
            'absolute',
            'top-2',
            'right-2',
            'px-2',
            'py-1',
            'text-white',
            'text-xs',
            'rounded-md',
            'bg-gray-700',
            'hover:bg-gray-600',
            'transition-colors'
        );
        button.innerText = 'Copy';

        button.addEventListener('click', () => {
            const textToCopy = pre.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                button.innerText = 'Copied!';
                button.classList.remove('bg-gray-700', 'hover:bg-gray-600', 'text-white');
                button.classList.add('bg-green-500', 'hover:bg-green-400', 'text-black');
                setTimeout(() => {
                    button.innerText = 'Copy';
                    button.classList.remove('bg-green-500', 'hover:bg-green-400', 'text-black');
                    button.classList.add('bg-gray-700', 'hover:bg-gray-600', 'text-white');
                }, 800);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });

        block.innerHTML = '';
        block.appendChild(pre);
        block.appendChild(button);
    });
}

function updateCommand(state: State) {
    const params: Option[] = [];
    Object.keys(state).forEach(k => {
        params.push({
            id: state[k],
            type: k
        })
    })
    query(filters.getEndpont(state), params)
        .then(result => {
            generateCode(result.url, result.headers);
        })
        .catch(error => {
            console.error(error);
        })
}

/**
 * Generates the filter form dynamically.
 */
function fillOption(holder: HTMLElement, state: State, option: FilterOption) {
    const btn = document.createElement('button');
    btn.type = 'button';

    const normalBtnClass = 'transition-colors text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700';
    const activeBtnClass = 'transition-colors text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800';
    if (filters.hasRecord([option], state))
        btn.className = activeBtnClass;
    else
        btn.className = normalBtnClass;
    btn.textContent = option.name;

    // Add click event listener to toggle selection
    btn.addEventListener('click', () => {
        let target = option;
        const newState: State = {};
        if (target.key)
            newState[target.key] = target.id;

        while (true) {
            if (target.key)
                newState[target.key] = target.id;
            if (target.child)
                target = target.child[0];
            else
                break;
        }

        target = option;
        console.log("parent", target.parent);
        while (target.parent) {
            target = target.parent;
            if (target.key)
                newState[target.key] = target.id;
        }
        console.log("newState", newState)
        generateForm(state, newState);
    });
    holder.appendChild(btn);
}

function dumpOption(state: State, options: FilterOption[], parentOption?: FilterOption): HTMLElement {
    const result = document.createElement('div');
    const categories = document.createElement('div');
    const subCategories = document.createElement('div');
    subCategories.className = 'box-border p-4 border-4 border-gray-700 rounded-lg';
    for (let option of options) {
        option.parent = parentOption;
        if (option.child) {
            if (option.child && option.child.length > 0) {
                fillOption(categories, state, option);
                if (filters.hasRecord([option], state)) {
                    subCategories.appendChild(dumpOption(state, option.child, option));
                }
            }
        } else {
            fillOption(categories, state, option);
        }
    }
    result.appendChild(categories);
    if (subCategories.children.length > 0)
        result.appendChild(subCategories);
    return result;
}

function generateForm(state: State, newState: State) {
    if (!filterForm) return;
    filterForm.innerHTML = '';
    const filterCategories = filters.getOptions(newState, state);
    state = newState;
    console.log("New state", state);
    filterCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'bg-gray-800 p-6 rounded-lg flex items-start';
        const titleDiv = document.createElement('div');
        titleDiv.className = 'w-1/4 pr-4 shrink-0';

        const title = document.createElement('h3');
        title.className = 'text-lg font-semibold text-gray-200';
        title.textContent = category.name;
        titleDiv.appendChild(title)
        categoryDiv.appendChild(titleDiv);

        categoryDiv.appendChild(dumpOption(state, category.getter(state)));
        filterForm.appendChild(categoryDiv);
    });
    updateCommand(state);
}

/**
 * Handles main tab switching.
 * @param {string} activeTab - The ID of the tab to activate ('encoding' or 'decoding').
 */
function switchMainTab(activeTab: string) {
    if (!tabEncodeBtn || !tabDecodeBtn || !encodingPanel || !decodingPanel) return;
    if (activeTab === 'encoding') {
        tabEncodeBtn.classList.add('bg-gray-700', 'text-white');
        tabEncodeBtn.classList.remove('bg-gray-800', 'text-gray-400');
        tabDecodeBtn.classList.add('bg-gray-800', 'text-gray-400');
        tabDecodeBtn.classList.remove('bg-gray-700', 'text-white');
        encodingPanel.classList.remove('hidden');
        decodingPanel.classList.add('hidden');
    } else {
        tabDecodeBtn.classList.add('bg-gray-700', 'text-white');
        tabDecodeBtn.classList.remove('bg-gray-800', 'text-gray-400');
        tabEncodeBtn.classList.add('bg-gray-800', 'text-gray-400');
        tabEncodeBtn.classList.remove('bg-gray-700', 'text-white');
        decodingPanel.classList.remove('hidden');
        encodingPanel.classList.add('hidden');
    }
}

/**
 * Handles sub-tab switching for code blocks.
 * @param {string} tabId - The ID of the sub-tab to activate ('sub-tab-js', etc.).
 */
function switchSubTab(tabId: string) {
    codeSubTabs.forEach(btn => {
        if (btn.id === tabId) {
            btn.classList.add('bg-gray-700', 'text-white');
            btn.classList.remove('bg-gray-800', 'text-gray-400');
        } else {
            btn.classList.remove('bg-gray-700', 'text-white');
            btn.classList.add('bg-gray-800', 'text-gray-400');
        }
    });

    codeBlocks.forEach(block => {
        if (block.id === `code-${tabId.split('-')[2]}`) {
            block.classList.remove('hidden');
        } else {
            block.classList.add('hidden');
        }
    });
}

/**
 * Toggles the mobile drawer visibility.
 */
function toggleMobilePanel() {
    if (rightPanel)
        rightPanel.classList.toggle('translate-x-full');
}



// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    if (!tabEncodeBtn || !tabDecodeBtn || !togglePanelBtn || !decodingInputArea) return;
    generateForm({}, {});

    tabEncodeBtn.addEventListener('click', () => switchMainTab('encoding'));
    tabDecodeBtn.addEventListener('click', () => switchMainTab('decoding'));

    codeSubTabs.forEach(btn => {
        btn.addEventListener('click', () => switchSubTab(btn.id));
    });

    togglePanelBtn.addEventListener('click', toggleMobilePanel);
    decodingInputArea.addEventListener('input', handleDecodingInput);
});
