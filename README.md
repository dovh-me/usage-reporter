# USAGE REPORTER
A simple resource usage report generator for **linux** flavored operating systems. This tool does not include a GUI and is mainly to be used on monitoring memory usage in non-GUI environments.

>Currently only records the memory usage

| **Resource** | **Tool being used** |
|--------------|---------------------|
| Memory       | free                |

## Prerequisites
- Linux flavored operating system
- NodeJs (17+)
- An http server (http-server from recommended) - To view the generated report

## How to use

1. Do `npm install`
2. Do `npm run record`
3. Enter `q` in the terminal to stop recording
4. Copy the `out/` directory to a local machine or wherever a browser can be launched
5. Host the content in `out/` in a http server

DEVELOPED AND DISTRIBUTED BY dovh-me
