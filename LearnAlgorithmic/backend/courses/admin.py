from django.contrib import admin
from .models import *


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ['title', 'order']


class ConceptInline(admin.TabularInline):
    model = Concept
    extra = 1


class ExampleInline(admin.TabularInline):
    model = Example
    extra = 1


class SimulationInline(admin.TabularInline):
    model = Simulation
    extra = 1


class QuizInline(admin.TabularInline):
    model = Quiz
    extra = 1


class ExerciseInline(admin.TabularInline):
    model = Exercise
    extra = 1


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'order']
    list_editable = ['order']
    ordering = ['order']
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'order']
    list_filter = ['module']
    ordering = ['module__order', 'order']
    inlines = [ConceptInline, ExampleInline, SimulationInline, QuizInline, ExerciseInline]


@admin.register(Concept)
class ConceptAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'order']
    list_filter = ['lesson__module']


@admin.register(Example)
class ExampleAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'order']
    list_filter = ['lesson__module']


@admin.register(Simulation)
class SimulationAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'order']
    list_filter = ['lesson__module']


class SimulationStepInline(admin.TabularInline):
    model = SimulationStep
    extra = 1


@admin.register(SimulationStep)
class SimulationStepAdmin(admin.ModelAdmin):
    list_display = ['simulation', 'step_number', 'description']
    list_filter = ['simulation__lesson__module']


class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 1


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'order']
    list_filter = ['lesson__module']
    inlines = [QuizQuestionInline]


class QuizChoiceInline(admin.TabularInline):
    model = QuizChoice
    extra = 4


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'quiz', 'question_type', 'points']
    list_filter = ['quiz__lesson__module', 'question_type']
    inlines = [QuizChoiceInline]


@admin.register(QuizChoice)
class QuizChoiceAdmin(admin.ModelAdmin):
    list_display = ['choice_text', 'question', 'is_correct']


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'points', 'order']
    list_filter = ['lesson__module']


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'module', 'is_unlocked', 'is_completed', 'completion_date']
    list_filter = ['is_unlocked', 'is_completed', 'module']
    search_fields = ['user__username']


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'is_completed', 'combined_score', 'quiz_score', 'exercise_score']
    list_filter = ['is_completed', 'lesson__module']
    search_fields = ['user__username']


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'percentage', 'completed_at']
    list_filter = ['quiz__lesson__module', 'completed_at']
    search_fields = ['user__username']


@admin.register(ExerciseSubmission)
class ExerciseSubmissionAdmin(admin.ModelAdmin):
    list_display = ['user', 'exercise', 'is_correct', 'score', 'submitted_at']
    list_filter = ['is_correct', 'exercise__lesson__module', 'submitted_at']
    search_fields = ['user__username']
