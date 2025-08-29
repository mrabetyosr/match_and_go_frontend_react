
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "./QuizManager.css"

const QuizManager = ({ quiz, offerId, token, onQuizUpdated, onClose }) => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details") // 'details', 'questions'
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [showEditQuestion, setShowEditQuestion] = useState(false)

  const [localQuizData, setLocalQuizData] = useState({
    title: quiz.title,
    nbrQuestions: quiz.nbrQuestions,
    durationSeconds: quiz.durationSeconds,
    createdAt: quiz.createdAt,
  })

  // Quiz edit states
  const [isEditingQuiz, setIsEditingQuiz] = useState(false)
  const [editQuizData, setEditQuizData] = useState({
    title: quiz.title,
    nbrQuestions: quiz.nbrQuestions,
    duration: Math.floor(quiz.durationSeconds / 60),
  })

  // New question states
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    questionType: "multiple-choice",
    choices: ["", "", "", ""],
    correctAnswer: "",
  })

  useEffect(() => {
    if (activeTab === "questions") {
      fetchQuestions()
    }
  }, [activeTab, quiz._id])

  useEffect(() => {
    setLocalQuizData({
      title: quiz.title,
      nbrQuestions: quiz.nbrQuestions,
      durationSeconds: quiz.durationSeconds,
      createdAt: quiz.createdAt,
    })
    setEditQuizData({
      title: quiz.title,
      nbrQuestions: quiz.nbrQuestions,
      duration: Math.floor(quiz.durationSeconds / 60),
    })
  }, [quiz])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:7001/api/questions/${quiz._id}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const fetchedQuestions = res.data || []
      setQuestions(fetchedQuestions)

      setLocalQuizData((prev) => ({
        ...prev,
        nbrQuestions: fetchedQuestions.length,
      }))
    } catch (error) {
      toast.error("Failed to fetch questions")
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = async (e) => {
    e.preventDefault()
    try {
      const questionData = {
        questionText: newQuestion.questionText,
        questionType: newQuestion.questionType,
        choices:
          newQuestion.questionType === "multiple-choice"
            ? newQuestion.choices.filter((choice) => choice.trim() !== "")
            : [],
        correctAnswer: newQuestion.correctAnswer,
      }

      await axios.post(`http://localhost:7001/api/questions/${quiz._id}/add`, questionData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success("Question added successfully")
      setNewQuestion({
        questionText: "",
        questionType: "multiple-choice",
        choices: ["", "", "", ""],
        correctAnswer: "",
      })
      setShowAddQuestion(false)

      await fetchQuestions()
      onQuizUpdated()
    } catch (error) {
      toast.error("Failed to add question")
      console.error("Error adding question:", error)
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    toast.info(
      <div>
        <p>Delete this question?</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={async () => {
              try {
                await axios.delete(`http://localhost:7001/api/questions/delete/${questionId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                toast.dismiss()
                toast.success("Question deleted successfully")

                await fetchQuestions()
                onQuizUpdated()
              } catch {
                toast.error("Failed to delete question")
              }
            }}
            style={{ background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{ background: "gray", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false },
    )
  }

  const handleUpdateQuiz = async (e) => {
    e.preventDefault()
    try {
      const updatedData = {
        ...editQuizData,
        durationSeconds: editQuizData.duration * 60,
      }

      await axios.put(`http://localhost:7001/api/offers/updatequiz/${quiz._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success("Quiz updated successfully")

      setLocalQuizData((prev) => ({
        ...prev,
        title: editQuizData.title,
        durationSeconds: editQuizData.duration * 60,
      }))

      setIsEditingQuiz(false)
      onQuizUpdated()
    } catch (error) {
      toast.error("Failed to update quiz")
      console.error("Error updating quiz:", error)
    }
  }

  const handleEditQuestion = (question) => {
    setEditingQuestion({
      ...question,
      choices: question.choices || ["", "", "", ""],
    })
    setShowEditQuestion(true)
  }

  const handleUpdateQuestion = async (e) => {
    e.preventDefault()
    try {
      const questionData = {
        questionText: editingQuestion.questionText,
        questionType: editingQuestion.questionType,
        choices:
          editingQuestion.questionType === "multiple-choice"
            ? editingQuestion.choices.filter((choice) => choice.trim() !== "")
            : [],
        correctAnswer: editingQuestion.correctAnswer,
        score: editingQuestion.score,
      }

      await axios.put(`http://localhost:7001/api/questions/update/${editingQuestion._id}`, questionData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success("Question updated successfully")
      setShowEditQuestion(false)
      setEditingQuestion(null)

      await fetchQuestions()
      onQuizUpdated()
    } catch (error) {
      toast.error("Failed to update question")
      console.error("Error updating question:", error)
    }
  }

  return (
    <div className="quiz-manager-overlay">
      <div className="quiz-manager-modal">
        <div className="quiz-manager-header">
          <div className="header-left">
            <h2>{localQuizData.title}</h2>
            <span className="quiz-meta">{localQuizData.nbrQuestions} Questions</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="quiz-tabs">
          <button className={`tab ${activeTab === "details" ? "active" : ""}`} onClick={() => setActiveTab("details")}>
            Quiz Details
          </button>
          <button
            className={`tab ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            Questions ({questions.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "details" && (
            <div className="quiz-details-tab">
              <div className="quiz-info">
                <div className="info-item">
                  <span className="info-label">Quiz Title:</span>
                  <span className="info-value">{localQuizData.title}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Number of Questions:</span>
                  <span className="info-value">{localQuizData.nbrQuestions}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{Math.floor(localQuizData.durationSeconds / 60)} minutes</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Created:</span>
                  <span className="info-value">{new Date(localQuizData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="quiz-actions">
                <button className="action-btn primary" onClick={() => setIsEditingQuiz(!isEditingQuiz)}>
                  {isEditingQuiz ? "Cancel Edit" : "Edit Quiz"}
                </button>
              </div>

              {isEditingQuiz && (
                <form className="edit-quiz-form" onSubmit={handleUpdateQuiz}>
                  <div className="form-group">
                    <label>Quiz Title:</label>
                    <input
                      type="text"
                      value={editQuizData.title}
                      onChange={(e) => setEditQuizData({ ...editQuizData, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes):</label>
                    <input
                      type="number"
                      min="5"
                      max="180"
                      value={editQuizData.duration}
                      onChange={(e) => setEditQuizData({ ...editQuizData, duration: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => setIsEditingQuiz(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === "questions" && (
            <div className="questions-tab">
              <div className="questions-header">
                <h3>Quiz Questions</h3>
                <button className="add-question-btn" onClick={() => setShowAddQuestion(true)}>
                  + Add Question
                </button>
              </div>

              {loading ? (
                <div className="loading">Loading questions...</div>
              ) : questions.length === 0 ? (
                <div className="empty-questions">
                  <p>No questions yet. Add your first question!</p>
                </div>
              ) : (
                <div className="questions-list">
                  {questions.map((question, index) => (
                    <div key={question._id} className="question-card">
                      <div className="question-header">
                        <span className="question-number">Q{index + 1}</span>
                        <div className="question-actions">
                          <button className="edit-question-btn" onClick={() => handleEditQuestion(question)}>
                            Edit
                          </button>
                          <button className="delete-question-btn" onClick={() => handleDeleteQuestion(question._id)}>
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="question-content">
                        <p className="question-text">{question.questionText}</p>

                        {question.questionType === "multiple-choice" && question.choices && (
                          <div className="choices-list">
                            {question.choices.map((choice, choiceIndex) => (
                              <div
                                key={choiceIndex}
                                className={`choice-item ${choice === question.correctAnswer ? "correct" : ""}`}
                              >
                                <span className="choice-letter">{String.fromCharCode(65 + choiceIndex)}</span>
                                <span className="choice-text">{choice}</span>
                                {choice === question.correctAnswer && <span className="correct-indicator">✓</span>}
                              </div>
                            ))}
                          </div>
                        )}

                        {question.questionType === "text" && (
                          <div className="text-answer">
                            <strong>Expected Answer:</strong> {question.correctAnswer}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Question Modal */}
{showAddQuestion && (
  <div className="modal-overlay">
    <div className="question-modal">
      <div className="modal-header">
        <h3>Add New Question</h3>
        <button onClick={() => setShowAddQuestion(false)}>×</button>
      </div>

      <form onSubmit={handleAddQuestion} className="question-form">
        <div className="form-group">
          <label>Question Text:</label>
          <textarea
            value={newQuestion.questionText}
            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
            required
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Question Type:</label>
          <select
            value={newQuestion.questionType}
            onChange={(e) => setNewQuestion({ ...newQuestion, questionType: e.target.value })}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="text">Text Answer</option>
          </select>
        </div>

        {newQuestion.questionType === "multiple-choice" && (
          <div className="form-group">
            <label>Choices:</label>
            {newQuestion.choices.map((choice, index) => (
              <div key={index} className="choice-input">
                <input
                  type="text"
                  placeholder={`Choice ${String.fromCharCode(65 + index)}`}
                  value={choice}
                  onChange={(e) => {
                    const updatedChoices = [...newQuestion.choices]
                    updatedChoices[index] = e.target.value
                    setNewQuestion({ ...newQuestion, choices: updatedChoices })
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label>Correct Answer:</label>
          {newQuestion.questionType === "multiple-choice" ? (
            <select
              value={newQuestion.correctAnswer}
              onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
              required
            >
              <option value="">Select correct answer</option>
              {newQuestion.choices
                .filter((choice) => choice.trim())
                .map((choice, index) => (
                  <option key={index} value={choice}>
                    {choice}
                  </option>
                ))}
            </select>
          ) : (
            <textarea
              value={newQuestion.correctAnswer}
              onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
              required
              rows="2"
            />
          )}
        </div>

        {/* ⚡ Ajout du champ Score */}
        <div className="form-group">
          <label>Score:</label>
          <input
            type="number"
            min="0"
            value={newQuestion.score || 1} // valeur par défaut 1
            onChange={(e) => setNewQuestion({ ...newQuestion, score: Number(e.target.value) })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Add Question
          </button>
          <button type="button" onClick={() => setShowAddQuestion(false)} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


        {/* Edit Question Modal */}
{showEditQuestion && editingQuestion && (
  <div className="modal-overlay">
    <div className="question-modal">
      <div className="modal-header">
        <h3>Edit Question</h3>
        <button onClick={() => setShowEditQuestion(false)}>×</button>
      </div>

      <form onSubmit={handleUpdateQuestion} className="question-form">
        <div className="form-group">
          <label>Question Text:</label>
          <textarea
            value={editingQuestion.questionText}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
            required
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Question Type:</label>
          <select
            value={editingQuestion.questionType}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, questionType: e.target.value })}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="text">Text Answer</option>
          </select>
        </div>

        {editingQuestion.questionType === "multiple-choice" && (
          <div className="form-group">
            <label>Choices:</label>
            {editingQuestion.choices.map((choice, index) => (
              <div key={index} className="choice-input">
                <input
                  type="text"
                  placeholder={`Choice ${String.fromCharCode(65 + index)}`}
                  value={choice}
                  onChange={(e) => {
                    const updatedChoices = [...editingQuestion.choices]
                    updatedChoices[index] = e.target.value
                    setEditingQuestion({ ...editingQuestion, choices: updatedChoices })
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label>Correct Answer:</label>
          {editingQuestion.questionType === "multiple-choice" ? (
            <select
              value={editingQuestion.correctAnswer}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })}
              required
            >
              <option value="">Select correct answer</option>
              {editingQuestion.choices
                .filter((choice) => choice.trim())
                .map((choice, index) => (
                  <option key={index} value={choice}>
                    {choice}
                  </option>
                ))}
            </select>
          ) : (
            <textarea
              value={editingQuestion.correctAnswer}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })}
              required
              rows="2"
            />
          )}
        </div>

        {/* ⚡ Ajout du champ Score */}
        <div className="form-group">
          <label>Score:</label>
          <input
            type="number"
            min="0"
            value={editingQuestion.score || 1}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, score: Number(e.target.value) })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Update Question
          </button>
          <button type="button" onClick={() => setShowEditQuestion(false)} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      </div>
    </div>
  )
}

export default QuizManager
