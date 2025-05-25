"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Code, Play, Save, FileCode, ArrowRight } from "lucide-react"

// Define types for our function builder
type ConditionType = {
  id: string
  left: string
  operator: string
  right: string
  type: "condition"
}

type ActionType = {
  id: string
  code: string
  type: "action"
}

type BlockType = ConditionType | ActionType

type FunctionType = {
  name: string
  description: string
  blocks: BlockType[]
}

export function CustomFunctionBuilder() {
  const [activeTab, setActiveTab] = useState("visual")
  const [functionName, setFunctionName] = useState("myCustomFunction")
  const [functionDescription, setFunctionDescription] = useState("A custom function for trading strategy")
  const [blocks, setBlocks] = useState<BlockType[]>([])
  const [generatedCode, setGeneratedCode] = useState("")
  const [editedCode, setEditedCode] = useState("")
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testInput, setTestInput] = useState("{ price: 18500, ltp: 18450, change: -0.5 }")

  // Operators for conditions
  const operators = [
    { value: "==", label: "equals (==)" },
    { value: "!=", label: "not equals (!=)" },
    { value: ">", label: "greater than (>)" },
    { value: "<", label: "less than (<)" },
    { value: ">=", label: "greater than or equal (>=)" },
    { value: "<=", label: "less than or equal (<=)" },
    { value: "&&", label: "AND (&&)" },
    { value: "||", label: "OR (||)" },
  ]

  // Generate unique ID for blocks
  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Add a condition block
  const addCondition = () => {
    const newCondition: ConditionType = {
      id: generateId(),
      left: "price",
      operator: ">",
      right: "18000",
      type: "condition",
    }
    setBlocks([...blocks, newCondition])
  }

  // Add an action block
  const addAction = () => {
    const newAction: ActionType = {
      id: generateId(),
      code: "return true;",
      type: "action",
    }
    setBlocks([...blocks, newAction])
  }

  // Remove a block
  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id))
  }

  // Update a condition block
  const updateCondition = (id: string, field: keyof ConditionType, value: string) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === id && block.type === "condition") {
          return { ...block, [field]: value } as ConditionType
        }
        return block
      }),
    )
  }

  // Update an action block
  const updateAction = (id: string, code: string) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === id && block.type === "action") {
          return { ...block, code } as ActionType
        }
        return block
      }),
    )
  }

  // Generate JavaScript code from blocks
  const generateJavaScriptCode = () => {
    let code = `function ${functionName}(context) {\n`
    code += `  // ${functionDescription}\n`

    // Add conditions
    const conditions = blocks.filter((block) => block.type === "condition") as ConditionType[]
    if (conditions.length > 0) {
      code += "  if ("
      code += conditions
        .map((condition) => {
          // Safely handle the condition parts
          const left = condition.left.includes(" ") ? `context["${condition.left}"]` : `context.${condition.left}`
          const right = isNaN(Number(condition.right))
            ? condition.right.includes(" ")
              ? `context["${condition.right}"]`
              : `context.${condition.right}`
            : condition.right

          return `${left} ${condition.operator} ${right}`
        })
        .join(" && ")
      code += ") {\n"
    }

    // Add actions
    const actions = blocks.filter((block) => block.type === "action") as ActionType[]
    if (actions.length > 0) {
      actions.forEach((action) => {
        const actionLines = action.code.split("\n")
        actionLines.forEach((line) => {
          code += `    ${line}\n`
        })
      })
    } else if (conditions.length > 0) {
      code += "    return true;\n"
    }

    // Close conditions
    if (conditions.length > 0) {
      code += "  } else {\n"
      code += "    return false;\n"
      code += "  }\n"
    }

    // If no blocks, add a default return
    if (blocks.length === 0) {
      code += "  return true;\n"
    }

    code += "}"
    return code
  }

  // Update generated code when blocks change
  useEffect(() => {
    const code = generateJavaScriptCode()
    setGeneratedCode(code)
    if (!editedCode) {
      setEditedCode(code)
    }
  }, [blocks, functionName, functionDescription])

  // Test the function with sample data
  const testFunction = () => {
    try {
      // Parse the test input
      const context = JSON.parse(testInput)

      // Create a function from the edited code
      const funcBody = editedCode.replace(/^function\s+\w+\s*$$[^)]*$$\s*\{/, "").replace(/\}$/, "")
      const testFunc = new Function("context", funcBody)

      // Execute the function
      const result = testFunc(context)
      setTestResult(`Result: ${result}`)
    } catch (error) {
      setTestResult(`Error: ${(error as Error).message}`)
    }
  }

  // Update blocks from edited code
  const updateBlocksFromCode = () => {
    try {
      // Very basic parsing - this is a simplified version
      const lines = editedCode.split("\n")
      const newBlocks: BlockType[] = []

      // Extract conditions from if statement
      const ifLineIndex = lines.findIndex((line) => line.trim().startsWith("if ("))
      if (ifLineIndex >= 0) {
        const ifLine = lines[ifLineIndex]
        const conditionMatch = ifLine.match(/if\s*$$(.*)$$/)

        if (conditionMatch && conditionMatch[1]) {
          // Very simple condition parsing - won't handle complex conditions well
          const conditions = conditionMatch[1].split("&&").map((c) => c.trim())

          conditions.forEach((condition) => {
            // Try to match a simple condition pattern
            const parts = condition.match(/([\w.[\]"]+)\s*([=!<>]+)\s*(.+)/)

            if (parts) {
              const [_, left, operator, right] = parts
              newBlocks.push({
                id: generateId(),
                left: left.replace(/context\./, "").replace(/context\["(.*?)"\]/, "$1"),
                operator,
                right: right.replace(/context\./, "").replace(/context\["(.*?)"\]/, "$1"),
                type: "condition",
              })
            }
          })
        }
      }

      // Extract action code
      const actionCode = lines
        .slice(ifLineIndex + 1, lines.findIndex((line) => line.trim() === "} else {") || lines.length)
        .filter((line) => line.trim() && !line.trim().startsWith("{"))
        .map((line) => line.trim().replace(/^\s{2,}/, ""))
        .join("\n")

      if (actionCode) {
        newBlocks.push({
          id: generateId(),
          code: actionCode,
          type: "action",
        })
      }

      setBlocks(newBlocks)
      setTestResult("Code parsed successfully")
    } catch (error) {
      setTestResult(`Error parsing code: ${(error as Error).message}`)
    }
  }

  // Save the function
  const saveFunction = () => {
    const functionData: FunctionType = {
      name: functionName,
      description: functionDescription,
      blocks,
    }

    // In a real app, you would save this to a database or local storage
    console.log("Function saved:", functionData)
    setTestResult("Function saved successfully")

    // You could also download it as a JSON file
    const dataStr = JSON.stringify(functionData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${functionName}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Add a template function
  const addTemplate = (template: string) => {
    switch (template) {
      case "priceCheck":
        setBlocks([
          {
            id: generateId(),
            left: "price",
            operator: ">",
            right: "18000",
            type: "condition",
          },
          {
            id: generateId(),
            code: "return true;",
            type: "action",
          },
        ])
        setFunctionName("checkPriceThreshold")
        setFunctionDescription("Check if price is above threshold")
        break
      case "changePercent":
        setBlocks([
          {
            id: generateId(),
            left: "change",
            operator: "<",
            right: "-1",
            type: "condition",
          },
          {
            id: generateId(),
            code: 'console.log("Price dropped more than 1%");\nreturn true;',
            type: "action",
          },
        ])
        setFunctionName("checkPriceDropPercent")
        setFunctionDescription("Check if price dropped more than 1%")
        break
      case "timeCheck":
        setBlocks([
          {
            id: generateId(),
            left: "time.getHours()",
            operator: ">=",
            right: "9",
            type: "condition",
          },
          {
            id: generateId(),
            left: "time.getHours()",
            operator: "<",
            right: "15",
            type: "condition",
          },
          {
            id: generateId(),
            code: 'return "Market is open";',
            type: "action",
          },
        ])
        setFunctionName("checkMarketHours")
        setFunctionDescription("Check if market is open")
        break
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="functionName">Function Name</Label>
          <Input
            id="functionName"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="functionDescription">Description</Label>
          <Input
            id="functionDescription"
            value={functionDescription}
            onChange={(e) => setFunctionDescription(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => addTemplate("priceCheck")}>
          <FileCode className="h-4 w-4 mr-1" /> Price Check Template
        </Button>
        <Button variant="outline" size="sm" onClick={() => addTemplate("changePercent")}>
          <FileCode className="h-4 w-4 mr-1" /> Change % Template
        </Button>
        <Button variant="outline" size="sm" onClick={() => addTemplate("timeCheck")}>
          <FileCode className="h-4 w-4 mr-1" /> Time Check Template
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="visual">Visual Builder</TabsTrigger>
          <TabsTrigger value="code">Code View</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4">
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={addCondition}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Condition
              </Button>
              <Button variant="outline" size="sm" onClick={addAction}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Action
              </Button>
            </div>
            <Button variant="default" size="sm" onClick={testFunction}>
              <Play className="h-4 w-4 mr-1" /> Test Function
            </Button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto p-2 border rounded-md">
            {blocks.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                No blocks added yet. Add a condition or action to start building your function.
              </div>
            ) : (
              blocks.map((block) => {
                if (block.type === "condition") {
                  return (
                    <div
                      key={block.id}
                      className="p-3 border rounded-md bg-blue-50 border-blue-200 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm text-blue-700">Condition</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => removeBlock(block.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Input
                            value={block.left}
                            onChange={(e) => updateCondition(block.id, "left", e.target.value)}
                            placeholder="Left operand"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Select
                            value={block.operator}
                            onValueChange={(value) => updateCondition(block.id, "operator", value)}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Input
                            value={block.right}
                            onChange={(e) => updateCondition(block.id, "right", e.target.value)}
                            placeholder="Right operand"
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={block.id}
                      className="p-3 border rounded-md bg-green-50 border-green-200 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm text-green-700">Action</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => removeBlock(block.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <textarea
                        value={block.code}
                        onChange={(e) => updateAction(block.id, e.target.value)}
                        placeholder="JavaScript code"
                        className="w-full h-20 p-2 text-sm font-mono border rounded-md bg-white"
                      />
                    </div>
                  )
                }
              })
            )}
          </div>

          <div className="p-3 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="testInput" className="text-sm font-medium">
                Test Input (JSON)
              </Label>
              <Button variant="ghost" size="sm" onClick={testFunction}>
                <Play className="h-4 w-4 mr-1" /> Run Test
              </Button>
            </div>
            <textarea
              id="testInput"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="w-full h-20 p-2 text-sm font-mono border rounded-md bg-white"
            />
            {testResult && (
              <div
                className={`mt-2 p-2 rounded-md ${testResult.startsWith("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
              >
                {testResult}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={updateBlocksFromCode}>
                <ArrowRight className="h-4 w-4 mr-1" /> Update Visual Builder
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditedCode(generatedCode)}>
                <Code className="h-4 w-4 mr-1" /> Reset Code
              </Button>
            </div>
            <Button variant="default" size="sm" onClick={testFunction}>
              <Play className="h-4 w-4 mr-1" /> Test Function
            </Button>
          </div>

          <div className="border rounded-md">
            <textarea
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              className="w-full h-[300px] p-3 text-sm font-mono bg-gray-50 rounded-md"
            />
          </div>

          <div className="p-3 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="codeTestInput" className="text-sm font-medium">
                Test Input (JSON)
              </Label>
              <Button variant="ghost" size="sm" onClick={testFunction}>
                <Play className="h-4 w-4 mr-1" /> Run Test
              </Button>
            </div>
            <textarea
              id="codeTestInput"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="w-full h-20 p-2 text-sm font-mono border rounded-md bg-white"
            />
            {testResult && (
              <div
                className={`mt-2 p-2 rounded-md ${testResult.startsWith("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
              >
                {testResult}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveFunction}>
          <Save className="h-4 w-4 mr-1" /> Save Function
        </Button>
      </div>
    </div>
  )
}
